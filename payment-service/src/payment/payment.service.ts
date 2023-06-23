import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { UpdatePaymentIntentDto } from './dto/update-payment-intent.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Bill } from './schemas/bill.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
    @Inject('ORDER_SERVICE')
    private readonly orderService: ClientProxy,
    @Inject('STRIPE_SERVICE')
    private readonly stripeService: ClientProxy,
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
    @Inject('MAILER_SERVICE')
    private readonly mailerService: ClientProxy,
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
      const price = await firstValueFrom(
        this.stripeService.send('STRIPE.CREATE_PRICE', {
          amount: serviceExists.price,
          productId: serviceExists.stripeId,
        }),
      );

      console.log(price);
      //creating stripe checkout session with created price
      const stripeCheckoutSession = await firstValueFrom(
        this.stripeService.send('STRIPE.CREATE_CHECKOUT_SESSION', {
          priceId: price.id,
          successUrl: 'http://localhost:3000/success',
          cancelUrl: 'http://localhost:3000/cancel',
        }),
      );

      if (!stripeCheckoutSession.id) {
        throw new RpcException({
          message: 'Error while creating payment intent',
          statusCode: 500,
        });
      }

      const bill = new this.billModel({
        ...createPaymentIntentDto,
        amount: serviceExists.price,
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

  async refundBill(billId: string) {
    const bill = await this.billModel.findById(new Types.ObjectId(billId));

    if (!bill) {
      throw new RpcException({
        message: 'Bill not found',
        statusCode: 404,
      });
    }

    if (!bill.stripePaymentIntentId) {
      throw new RpcException({
        message: 'Bill has no payment intent id',
        statusCode: 404,
      });
    }

    if (bill.status == 'REFUNDED') {
      throw new RpcException({
        message: 'Bill already refunded',
        statusCode: 404,
      });
    }

    const refund = await firstValueFrom(
      this.stripeService.send('STRIPE.REFUND_PAYMENT_INTENT', {
        paymentIntentId: bill.stripePaymentIntentId,
      }),
    );

    if (!refund) {
      throw new RpcException({
        message: 'Error while creating refund',
        statusCode: 500,
      });
    }

    bill.status = 'REFUNDED';
    bill.stripeRefundId = refund.id;
    await bill.save();

    return { success: true, message: 'Bill refunded' };
  }

  async payPrestationToProvider(billId: string) {
    try {
      const bill = await this.billModel.findById(new Types.ObjectId(billId));

      if (!bill) {
        throw new RpcException({
          message: 'Bill not found',
          statusCode: 404,
        });
      }

      if (bill.status !== 'PAID') {
        throw new RpcException({
          message: 'Bill not paid',
          statusCode: 404,
        });
      }

      const prestation = await firstValueFrom(
        this.prestationService.send('PRESTATION.GET_ONE', bill.serviceId),
      );

      if (!prestation) {
        throw new RpcException({
          message: 'Service not found',
          statusCode: 404,
        });
      }

      const provider = await firstValueFrom(
        this.userService.send('getUserById', { id: prestation.owner }),
      );

      if (!provider) {
        throw new RpcException({
          message: 'Service provider not found',
          statusCode: 404,
        });
      }

      if (!provider.stripeAccountId) {
        throw new RpcException({
          message: 'Provider has no stripe account',
          statusCode: 404,
        });
      }

      await firstValueFrom(
        this.stripeService.send('STRIPE.TRANSFER_FUNDS', {
          stripeConnectAccountId: provider.stripeAccountId,
          amount: bill.amount,
          currency: 'eur',
          description: `Paiement de la prestation ${prestation.title}`,
        }),
      );

      this.sendMoneyTransferedEmail(provider._id, prestation.name, bill.amount);

      return { success: true, message: 'Bill payment transfered' };
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }

      throw new RpcException({
        message: e.message,
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

  // Stripe Webhook callbaks

  public async updatePaymentIntent(data: UpdatePaymentIntentDto) {
    const { paymentIntentId, sessionId } = data;
    const bill = await this.billModel.findOne({
      stripeSessionId: sessionId,
    });
    if (!bill) {
      throw new RpcException({
        message: 'Bill not found',
        statusCode: 404,
      });
    }
    bill.stripePaymentIntentId = paymentIntentId;
    await bill.save();
    return { success: true, message: 'Payment intent updated' };
  }

  public async confirmPayment(data: UpdatePaymentStatusDto) {
    const { paymentIntentId } = data;

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

    const newOrder = await await firstValueFrom(
      this.orderService.send('ORDER.CREATE', {
        applicant: bill.userId,
        serviceId: bill.serviceId,
        billId: bill._id,
      }),
    );

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

    return { success: true, message: 'Bill processed' };
  }

  public async cancelPayment(data: UpdatePaymentStatusDto) {
    const { paymentIntentId } = data;

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

    return { success: true, message: 'Bill canceled' };
  }

  // Mails
  sendMoneyTransferedEmail(userId: string, prestation: string, amount: number) {
    this.mailerService.emit('MAILER.SEND_INFORMATIVE_MAIL', {
      targetId: userId,
      subject: 'Your prestation is over 🎉',
      text: `Your ${prestation} service has come to an end. Your stripe account is about to be credited with ${amount}€ ✨. Have a nice day!`,
    });
  }
}
