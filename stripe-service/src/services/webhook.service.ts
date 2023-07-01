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

  // Unique Api endpoint for testing purposes

  async handleWebhookDev(data: HandleWebhookDto) {
    try {
      const { req, stripeSig } = data;

      const rawBuffer = Buffer.from(req);
      const event = this.stripe.webhooks.constructEvent(
        rawBuffer,
        stripeSig,
        process.env.STRIPE_WH_ACCOUNT_SECRET,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          return await this.confirmPayment(event);

        case 'payment_intent.payment_failed':
        case 'payment_intent.canceled':
        case 'payment_intent.expired':
          return await this.cancelPayment(event);

        case 'capability.updated':
          return await this.updateCapability(event);
      }

      throw new RpcException({
        message: 'Event type not handled',
        statusCode: 500,
      });
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: 'Error while handling stripe event',
        statusCode: 500,
      });
    }
  }

  async handleWebhookPayment(data: HandleWebhookDto) {
    try {
      const { req, stripeSig } = data;

      const rawBuffer = Buffer.from(req);
      const event = this.stripe.webhooks.constructEvent(
        rawBuffer,
        stripeSig,
        process.env.STRIPE_WH_PAYMENT_SECRET,
      );

      switch (event.type) {
        // case 'checkout.session.completed':
        //   return await this.updatePaymentIntent(event);

        case 'payment_intent.succeeded':
          return await this.confirmPayment(event);

        case 'payment_intent.payment_failed':
        case 'payment_intent.canceled':
        case 'payment_intent.expired':
          return await this.cancelPayment(event);
      }

      throw new RpcException({
        message: 'Event type not handled',
        statusCode: 500,
      });
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: 'Error while handling stripe event',
        statusCode: 500,
      });
    }
  }

  async handleWebhookAccount(data: HandleWebhookDto) {
    try {
      const { req, stripeSig } = data;

      const rawBuffer = Buffer.from(req);
      const event = this.stripe.webhooks.constructEvent(
        rawBuffer,
        stripeSig,
        process.env.STRIPE_WH_ACCOUNT_SECRET,
      );

      switch (event.type) {
        case 'capability.updated':
          return await this.updateCapability(event);
      }

      throw new RpcException({
        message: 'Event type not handled',
        statusCode: 500,
      });
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: 'Error while handling stripe event',
        statusCode: 500,
      });
    }
  }

  // Payment
  // private async updatePaymentIntent(event: Stripe.Event) {
  //   const sessionId = event.data.object['id'];
  //   const paymentIntentId = event.data.object['payment_intent'];

  //   return await firstValueFrom(
  //     this.paymentService.send('PAYMENT.UPDATE_PAYMENT_INTENT', {
  //       sessionId,
  //       paymentIntentId,
  //     }),
  //   );
  // }

  private async confirmPayment(event: Stripe.Event) {
    console.log(event.data.object?.['metadata']?.['billId']);
    const billId = event.data.object?.['metadata']?.['billId'];
    if (!billId)
      throw new RpcException({
        message: 'Bill id not found',
        statusCode: 500,
      });

    return await firstValueFrom(
      this.paymentService.send('PAYMENT.CONFIRM_PAYMENT', {
        billId,
      }),
    );
  }

  private async cancelPayment(event: Stripe.Event) {
    const billId = event.data.object?.['metadata']?.['billId'];
    if (!billId)
      throw new RpcException({
        message: 'Bill id not found',
        statusCode: 500,
      });

    return await firstValueFrom(
      this.paymentService.send('PAYMENT.CANCEL_PAYMENT', {
        billId,
      }),
    );
  }

  // Account
  private async updateCapability(event: any) {
    const { account } = event;
    const { status } = event.data.object;

    return await firstValueFrom(
      this.userService.send('USER.PROMOTE_OR_DEMOTE', {
        stripeAccountId: account,
        promote: status === 'active',
      }),
    );
  }
}
