import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { StripeWebhookAnswer } from './dto/stripe-webhook-answer.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('getHello')
  async getHello(): Promise<string> {
    return await this.paymentService.getHello();
  }

  @EventPattern('PAYMENT.CREATE_PAYMENT_INTENT')
  async createPaymentIntent(data: CreatePaymentIntentDto) {
    return await this.paymentService.createPaymentIntent(data);
  }

  @EventPattern('PAYMENT.UPDATE_BILL_STATUS')
  async updateBillStatus(@Payload() payload: StripeWebhookAnswer) {
    return await this.paymentService.updateBillStatus(payload);
  }

  @EventPattern('PAYMENT.GET_BILLS_OF_USER')
  async getBillsOfUser(userId: string) {
    return await this.paymentService.getBillsOfUser(userId);
  }
}
