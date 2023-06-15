import { Controller, Get, Inject, Param, Patch, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  // Admin specific routes

  @Get('/all')
  @Roles(ROLE.ADMIN)
  public getAllOrders() {
    return this.orderService.send('ORDER.GET_ALL_ORDERS', {});
  }

  @Get('/user/:userId')
  @Roles(ROLE.ADMIN)
  public getUserOrders(@Param('userId') userId: string) {
    return this.orderService.send('ORDER.GET_ORDERS_OF_USER', userId);
  }

  @Get()
  public getOrderHello() {
    return this.orderService.send('getHello', {});
  }

  @Get('/self')
  public getSelfOrders(@Req() req: any) {
    return this.orderService.send('ORDER.GET_ORDERS_OF_USER', req.user._id);
  }

  @Get('/request/pending')
  public getSelfRequestOrders(@Req() req: any) {
    return this.orderService.send('ORDER.GET_PENDING_REQUESTS', req.user._id);
  }

  @Patch('/request/:orderId/accept')
  public acceptRequestOrder(
    @Req() req: any,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.send('ORDER.ACCEPT_REQUEST', {
      userId: req.user._id,
      orderId,
    });
  }

  @Patch('/request/:orderId/refuse')
  public refuseRequestOrder(
    @Req() req: any,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.send('ORDER.REFUSE_REQUEST', {
      userId: req.user._id,
      orderId,
    });
  }

  @Get(':orderId')
  public getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.send('ORDER.GET_ORDER', orderId);
  }
}
