import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './services/payment-service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreatePriceDto } from './dto/create-price.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { HandleWebhookDto } from './dto/handle-webhook.dto';
import { RefundPaymentIntentDto } from './dto/refund-payment-intent.dto';
import { WebhookService } from './services/webhook.service';
import { AccountService } from './services/account.service';

@Controller()
export class AppController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly webhookService: WebhookService,
    private readonly accountService: AccountService,
  ) {}

  // Payment/products

  @EventPattern('STRIPE.CREATE_PRICE')
  async createPrice(@Payload() data: CreatePriceDto) {
    return this.paymentService.createPrice(data);
  }

  @EventPattern('STRIPE.CREATE_CHECKOUT_SESSION')
  async createCheckoutSession(@Payload() data: CreateCheckoutSessionDto) {
    return this.paymentService.createCheckoutSession(data);
  }

  @EventPattern('STRIPE.REFUND_PAYMENT_INTENT')
  async refund(@Payload() data: RefundPaymentIntentDto) {
    return this.paymentService.refund(data);
  }

  // Webhooks
  
  @EventPattern('STRIPE.HANDLE_WEBHOOK')
  async handleWebhook(@Payload() data: HandleWebhookDto) {
    return this.webhookService.handleWebhook(data);
  }

  // Accounts

}
