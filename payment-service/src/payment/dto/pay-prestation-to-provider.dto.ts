import { IsString } from 'class-validator';

export class PayPrestationToProviderDto {
  @IsString()
  orderId: string;
}
