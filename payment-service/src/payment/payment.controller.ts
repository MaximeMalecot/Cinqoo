import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { UpdatePaymentIntentDto } from './dto/update-payment-intent.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
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

  @EventPattern('PAYMENT.GET_BILLS_OF_USER')
  async getBillsOfUser(userId: string) {
    return await this.paymentService.getBillsOfUser(userId);
  }

  @EventPattern('PAYMENT.REFUND_BILL')
  async refundBill(billId: string) {
    return await this.paymentService.refundBill(billId);
  }

  @EventPattern('PAYMENT.UPDATE_PAYMENT_INTENT')
  async updatePaymentIntent(@Payload() data: UpdatePaymentIntentDto) {
    return await this.paymentService.updatePaymentIntent(data);
  }

  @EventPattern('PAYMENT.CONFIRM_PAYMENT')
  async confirmPayment(@Payload() data: UpdatePaymentStatusDto) {
    return await this.paymentService.confirmPayment(data);
  }

  @EventPattern('PAYMENT.CANCEL_PAYMENT')
  async cancelPayment(@Payload() data: UpdatePaymentStatusDto) {
    return await this.paymentService.cancelPayment(data);
  }
}
