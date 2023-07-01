import { IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsString()
  billId: string;
}
