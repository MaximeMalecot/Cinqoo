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
        stripeId: stripeCheckoutSession.id,
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

  async updateBillStatus(stripeWebhookAnswer: StripeWebhookAnswer) {
    try {
      const { data, stripeSig } = stripeWebhookAnswer;

      // retrieve the event by verifying the signature using the raw body and secret
      const rawBuffer = Buffer.from(data);
      const event = this.stripe.webhooks.constructEvent(
        rawBuffer,
        stripeSig,
        process.env.STRIPE_WH_SECRET,
      );

      // const bill = await this.billModel.findOne({
      //   stripeId: stripeWebhookAnswer.id,
      // });

      // if (!bill) {
      //   throw new RpcException({
      //     message: 'Bill not found',
      //     statusCode: 404,
      //   });
      // }

      // if (bill.status === 'SUCCESS' || bill.status === 'FAILED') {
      //   return { success: true, message: 'Bill already processed' };
      // }

      // if (status !== 'SUCCESS') {
      //   bill.status = 'FAILED';
      //   await bill.save();
      //   return { success: true, message: 'Bill status updated to failed' };
      // }

      // const newOrder = { id: '12' }; // MOCK
      // if (!newOrder) {
      //   bill.status = 'FAILED';
      //   await bill.save();
      //   throw new RpcException({
      //     message: 'Error while creating order',
      //     statusCode: 500,
      //   });
      // }
      // bill.status = 'SUCCESS';
      // await bill.save();

      // return { success: true, message: 'Order created' };
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

  async getBillsOfUser(userId: string) {
    const bills = await this.billModel
      .find({ userId: new Types.ObjectId(userId) })
      .select({
        __v: false,
      });
    return bills;
  }
}
