import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreatePriceDto } from './dto/create-price.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { HandleWebhookDto } from './dto/handle-webhook.dto';
import { RefundPaymentIntentDto } from './dto/refund-payment-intent.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('STRIPE.CREATE_PRICE')
  async createPrice(@Payload() data: CreatePriceDto) {
    return this.appService.createPrice(data);
  }

  @EventPattern('STRIPE.CREATE_CHECKOUT_SESSION')
  async createCheckoutSession(@Payload() data: CreateCheckoutSessionDto) {
    return this.appService.createCheckoutSession(data);
  }

  @EventPattern('STRIPE.HANDLE_WEBHOOK')
  async handleWebhook(@Payload() data: HandleWebhookDto) {
    return this.appService.handleWebhook(data);
  }

  @EventPattern('STRIPE.REFUND_PAYMENT_INTENT')
  async refund(@Payload() data: RefundPaymentIntentDto) {
    return this.appService.refund(data);
  }
}
