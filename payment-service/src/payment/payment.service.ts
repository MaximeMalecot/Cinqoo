import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { StripeWebhookAnswer } from './dto/stripe-webhook-answer.dto';
import { Bill } from './schemas/bill.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  async getHello(): Promise<string> {
    const billCount = await this.billModel.countDocuments();
    return `Payment service : there are currently ${billCount} bills in the database`;
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    try {
      //checking if service exists
      const serviceExists = await firstValueFrom(
        this.prestationService.send(
          'PRESTATION.GET_ONE',
          createPaymentIntentDto.serviceId,
        ),
      );

      if (!serviceExists) {
        throw new RpcException({
          message: 'Service not found',
          statusCode: 404,
        });
      }

      //creating stripe price
      const price = await this.stripe.prices.create({
        currency: 'eur',
        unit_amount: serviceExists.price * 100,
        product: serviceExists.stripeId,
      });

      //creating stripe checkout session with created price
      const stripeCheckoutSession = await this.stripe.checkout.sessions.create({
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
        mode: 'payment',
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
      });

      if (!stripeCheckoutSession.id) {
        throw new RpcException({
          message: 'Error while creating payment intent',
          statusCode: 500,
        });
      }

      const bill = new this.billModel({
        ...createPaymentIntentDto,
        stripeSessionId: stripeCheckoutSession.id,
        userId: new Types.ObjectId(createPaymentIntentDto.userId),
      });
      const newBill = await bill.save();
      return { url: stripeCheckoutSession.url };
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: e.message ?? 'Error while creating payment intent ',
        statusCode: e.statusCode ?? 500,
      });
    }
  }

  async stripeWhHandler(stripeWebhookAnswer: StripeWebhookAnswer) {
    try {
      const { data, stripeSig } = stripeWebhookAnswer;

      // retrieve the event by verifying the signature using the raw body and secret
      const rawBuffer = Buffer.from(data);
      const event = this.stripe.webhooks.constructEvent(
        rawBuffer,
        stripeSig,
        process.env.STRIPE_WH_SECRET,
      );

      switch (event.type) {
        case 'checkout.session.completed':
          await this.updatePaymentIntent(event);
          return { message: 'Payment intent updated' };

        case 'payment_intent.succeeded':
          await this.confirmPayment(event);
          return { message: 'Payment confirmed' };

        case 'payment_intent.payment_failed':
        case 'payment_intent.canceled':
        case 'payment_intent.expired':
          await this.cancelPayment(event);
          return { message: 'Payment canceled' };
      }

      return new RpcException({
        message: 'Event type not handled',
        statusCode: 500,
      });
    } catch (e: any) {
      console.log(e.message);
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: 'Error while updating bill status',
        statusCode: 500,
      });
    }
  }

  private async updatePaymentIntent(event: Stripe.Event) {
    const paymentIntent = event.data.object['payment_intent'];
    const bill = await this.billModel.findOne({
      stripeSessionId: event.data.object['id'],
    });
    if (!bill) {
      throw new RpcException({
        message: 'Bill not found',
        statusCode: 404,
      });
    }
    bill.stripePaymentIntentId = paymentIntent;
    await bill.save();
    console.log('payment intent', paymentIntent);
  }

  private async confirmPayment(event: Stripe.Event) {
    const paymentIntentId = event.data.object['id'];

    const bill = await this.billModel.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!bill) {
      throw new RpcException({
        message: 'Bill not found',
        statusCode: 404,
      });
    }

    if (bill.status !== 'PENDING') {
      return { success: true, message: 'Bill already processed' };
    }

    const newOrder = { id: '12' }; // MOCK
    if (!newOrder) {
      bill.status = 'TO_BE_REFUNDED';
      await bill.save();
      throw new RpcException({
        message: 'Error while creating order',
        statusCode: 500,
      });
    }
    bill.status = 'PAID';
    await bill.save();
  }

  private async cancelPayment(event: Stripe.Event) {
    const paymentIntentId = event.data.object['id'];

    const bill = await this.billModel.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!bill) {
      throw new RpcException({
        message: 'Bill not found',
        statusCode: 404,
      });
    }

    if (bill.status !== 'PENDING') {
      return { success: true, message: 'Bill already processed' };
    }
    bill.status = 'FAILED';
    await bill.save();
  }

  async getBillsOfUser(userId: string) {
    const bills = await this.billModel
      .find({ userId: new Types.ObjectId(userId) })
      .select({
        __v: false,
      });
    return bills;
  }
}
