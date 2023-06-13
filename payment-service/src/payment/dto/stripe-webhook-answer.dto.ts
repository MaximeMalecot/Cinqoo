import { IsObject, IsString } from 'class-validator';

export class StripeWebhookAnswer {
  @IsObject()
  data: any;

  @IsString()
  stripeSig: string;
}
