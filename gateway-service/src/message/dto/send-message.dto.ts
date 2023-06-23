import { IsString } from 'class-validator';
import { IsMongoIdObject } from 'src/decorators/mongoId.decorator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsMongoIdObject()
  orderId: string;
}
