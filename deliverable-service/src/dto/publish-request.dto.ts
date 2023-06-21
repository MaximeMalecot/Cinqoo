import { IsString } from 'class-validator';

export class PublishRequestDto {
  @IsString()
  link: string;

  @IsString()
  name: string;

  @IsString()
  orderId: string;
}
