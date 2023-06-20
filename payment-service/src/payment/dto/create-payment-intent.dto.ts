import { IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  userId: string;

  @IsString()
  serviceId: string;
}
