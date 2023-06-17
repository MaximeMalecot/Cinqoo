import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './stripe/constants';
import { CreatePriceDto } from './dto/create-price.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { HandleWebhookDto } from './dto/handle-webhook.dto';
import { RpcException } from '@nestjs/microservices';
import { RefundPaymentIntentDto } from './dto/refund-payment-intent.dto';

@Injectable()
export class AppService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async createPrice(data: CreatePriceDto) {
    const { productId, amount } = data;

    const price = await this.stripe.prices.create({
      currency: 'eur',
      unit_amount: amount * 100,
      product: productId,
    });

    return price;
  }

  async createCheckoutSession(data: CreateCheckoutSessionDto) {
    const { priceId, successUrl, cancelUrl } = data;
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
    });

    return session;
  }

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

  async refund(data: RefundPaymentIntentDto) {
    try {
      const { paymentIntentId } = data;

      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });

      return refund;
    } catch (e: any) {
      console.log(e.message);
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: 'Error while refunding payment intent',
        statusCode: 500,
      });
    }
  }
}
