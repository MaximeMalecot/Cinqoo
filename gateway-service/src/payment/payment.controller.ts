import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { StripeWebhookAnswer } from './dto/stripe-webhook-answer.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentService: ClientProxy,
  ) {}

  @Get()
  public getPaymentHello() {
    return this.paymentService.send('getHello', {});
  }

  @Post()
  public createPaymentIntent(@Body() data: CreatePaymentIntentDto) {
    return this.paymentService.send('PAYMENT.CREATE_PAYMENT_INTENT', data);
  }

  @Post("/webhook")
  public updateBillStatus(@Body() data: StripeWebhookAnswer) {
    return this.paymentService.send('PAYMENT.UPDATE_BILL_STATUS', data);
  }
}
