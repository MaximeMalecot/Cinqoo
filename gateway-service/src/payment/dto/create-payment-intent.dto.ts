import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  userId: string;

  @IsString()
  serviceId: string;

  @IsNumber()
  amount: number;
}
