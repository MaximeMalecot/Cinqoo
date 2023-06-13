import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  @Get()
  public getOrderHello() {
    return this.orderService.send('getHello', {});
  }

  @Get('/self')
  public getSelfOrders(@Req() req: any) {
    return this.orderService.send('ORDER.GET_ORDERS_OF_USER', req.user._id);
  }
}
