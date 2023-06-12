import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  serviceId: string;

  @IsNumber()
  amount: number;
}
