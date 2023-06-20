import { IsString } from 'class-validator';

export class UpdateRequestDto {
  @IsString()
  userId: string;

  @IsString()
  orderId: string;
}
