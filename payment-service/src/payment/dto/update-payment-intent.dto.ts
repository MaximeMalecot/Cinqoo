import { IsString } from 'class-validator';

export class UpdatePaymentIntentDto {
  @IsString()
  sessionId: string;

  @IsString()
  paymentIntentId: string;
}
