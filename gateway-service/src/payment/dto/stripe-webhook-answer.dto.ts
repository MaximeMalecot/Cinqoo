import { IsNumber, IsString } from 'class-validator';

export class StripeWebhookAnswer {
  @IsString()
  id: string;

  @IsString()
  status: 'SUCCESS' | 'FAILED';

  @IsNumber()
  amount: number;
}
