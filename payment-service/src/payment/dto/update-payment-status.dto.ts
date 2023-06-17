import { IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsString()
  paymentIntentId: string;
}
