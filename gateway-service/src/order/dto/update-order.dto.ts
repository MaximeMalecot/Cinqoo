import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enums/order.enum';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status: string;
}
