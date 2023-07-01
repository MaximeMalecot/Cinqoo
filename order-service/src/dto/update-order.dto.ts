import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from 'src/schemas/order.schema';

export class UpdateOrderDto {
  @IsString()
  orderId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
