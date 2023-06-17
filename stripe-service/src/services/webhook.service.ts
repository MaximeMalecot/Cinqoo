import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/constants';
import { CreatePriceDto } from '../dto/create-price.dto';
import { CreateCheckoutSessionDto } from '../dto/create-checkout-session.dto';
import { HandleWebhookDto } from '../dto/handle-webhook.dto';
import { RpcException } from '@nestjs/microservices';
import { RefundPaymentIntentDto } from '../dto/refund-payment-intent.dto';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class WebhookService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async handleWebhook(data: HandleWebhookDto) {
    try {
      const { req, stripeSig } = data;

      const rawBuffer = Buffer.from(req);
      const event = this.stripe.webhooks.constructEvent(
        rawBuffer,
        stripeSig,
        process.env.STRIPE_WH_SECRET,
      );

      switch (event.type) {
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
}
