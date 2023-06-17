import { IsNumber, IsObject, IsString } from 'class-validator';

export class HandleWebhookDto {
  @IsObject()
  req: any;

  @IsString()
  stripeSig: string;
}
