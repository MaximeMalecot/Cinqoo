import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  applicant: string;

  @IsString()
  serviceId: string;

  @IsString()
  billId: string;
}
