import { IsNumber, IsString } from 'class-validator';

export class RefundPaymentIntentDto {
  @IsString()
  paymentIntentId: string;
}
