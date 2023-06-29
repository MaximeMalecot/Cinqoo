import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TransferFundsToConnectAccount } from 'src/dto/transfer-fund-to-connect-account.dto';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from '../dto/create-checkout-session.dto';
import { CreatePriceDto } from '../dto/create-price.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { RefundPaymentIntentDto } from '../dto/refund-payment-intent.dto';
import { STRIPE_CLIENT } from '../stripe/constants';

@Injectable()
export class PaymentService {
  fees = 0.2;

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

  async createProduct(data: CreateProductDto) {
    try {
      const { name } = data;
      const product = await this.stripe.products.create({
        name: name,
      });

      return product;
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: 'Error while creating product',
        statusCode: 500,
      });
    }
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

  async transferFunds(data: TransferFundsToConnectAccount) {
    try {
      const { amount, stripeConnectAccountId, description, currency } = data;
      // const amount = rawAmount * (1 - this.fees);
      const transfer = await this.stripe.transfers.create({
        amount: parseInt((amount * 100).toFixed(1)),
        currency: currency,
        destination: stripeConnectAccountId,
        description: description ?? 'Transfer to connect account',
      });

      return transfer;
    } catch (e: any) {
      console.log(e.message);
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: 'Error while transfering funds',
        statusCode: 500,
      });
    }
  }
}
