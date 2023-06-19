import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import Stripe from 'stripe';
import { HandleWebhookDto } from '../dto/handle-webhook.dto';
import { STRIPE_CLIENT } from '../stripe/constants';

@Injectable()
export class WebhookService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    @Inject('PAYMENT_SERVICE') private readonly paymentService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

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
        case 'checkout.session.completed':
          return await this.updatePaymentIntent(event);

        case 'payment_intent.succeeded':
          return await this.confirmPayment(event);

        case 'payment_intent.payment_failed':
        case 'payment_intent.canceled':
        case 'payment_intent.expired':
          return await this.cancelPayment(event);

        case 'account.updated':
        case 'capability.updated':
          return await this.updateAccount(event);
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
    const sessionId = event.data.object['id'];
    const paymentIntentId = event.data.object['payment_intent'];

    return await firstValueFrom(
      this.paymentService.send('PAYMENT.UPDATE_PAYMENT_INTENT', {
        sessionId,
        paymentIntentId,
      }),
    );
  }

  private async confirmPayment(event: Stripe.Event) {
    const paymentIntentId = event.data.object['id'];

    return await firstValueFrom(
      this.paymentService.send('PAYMENT.CONFIRM_PAYMENT', {
        paymentIntentId,
      }),
    );
  }

  private async cancelPayment(event: Stripe.Event) {
    const paymentIntentId = event.data.object['id'];

    return await firstValueFrom(
      this.paymentService.send('PAYMENT.CANCEL_PAYMENT', {
        paymentIntentId,
      }),
    );
  }

  private async updateAccount(event: Stripe.Event) {
    const account = event.data.object as Stripe.Account;
    const capabilities = account.capabilities as String;
    console.log(account, capabilities);

    return await firstValueFrom(
      this.userService.send('USER.PROMOTE_OR_DEMOTE', {
        stripeAccountId: account.id,
        capabilities,
      }),
    );
  }
}
