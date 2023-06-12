import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { StripeWebhookAnswer } from './dto/stripe-webhook-answer.dto';
import { Bill } from './schemas/bill.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

  async getHello(): Promise<string> {
    const billCount = await this.billModel.countDocuments();
    return `Payment service : there are currently ${billCount} bills in the database`;
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    try {
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

      const stripeCheckoutSession: null | any = {
        id: `stripe_ckout_session_${crypto.randomUUID().toString()}`,
      }; // MOCK

      if (!stripeCheckoutSession || !stripeCheckoutSession?.id) {
        throw new RpcException({
          message: 'Error while creating payment intent',
          statusCode: 500,
        });
      }

      const bill = new this.billModel({
        ...createPaymentIntentDto,
        stripeId: stripeCheckoutSession.id,
      });
      const newBill = await bill.save();
      return newBill.toObject();
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
      const { id, status, amount } = stripeWebhookAnswer;

      const bill = await this.billModel.findOne({
        stripeId: stripeWebhookAnswer.id,
      });

      if (!bill) {
        throw new RpcException({
          message: 'Bill not found',
          statusCode: 404,
        });
      }

      if (bill.status === 'SUCCESS' || bill.status === 'FAILED') {
        return { success: true, message: 'Bill already processed' };
      }

      if (status !== 'SUCCESS') {
        bill.status = 'FAILED';
        await bill.save();
        return { success: true, message: 'Bill status updated to failed' };
      }

      const newOrder = { id: '12' }; // MOCK
      if (!newOrder) {
        bill.status = 'FAILED';
        await bill.save();
        throw new RpcException({
          message: 'Error while creating order',
          statusCode: 500,
        });
      }
      bill.status = 'SUCCESS';
      await bill.save();

      return { success: true, message: 'Order created' };
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: 'Error while updating bill status',
        statusCode: 500,
      });
    }
  }
}
