import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { firstValueFrom } from 'rxjs';
import { ROLE } from 'src/auth/enums/role.enum';

@Injectable()
export class IsAllowedToPublish implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    if (user.roles.includes(ROLE.ADMIN)) return true;
    const orderId = context.switchToHttp().getRequest().params.orderId;
    if (!ObjectId.isValid(orderId))
      throw new NotFoundException({ message: 'Invalid order id' });
    const order = await firstValueFrom(
      this.orderService.send('ORDER.GET_ORDER_WITH_PRESTATION', orderId),
    );
    if (!order) throw new NotFoundException({ message: 'Order not found' });
    if (order.status !== 'IN_PROGRESS')
      throw new UnauthorizedException({ message: 'Order is not in progress' });
    if (order.prestation.owner === user._id) return true;
    return false;
  }
}
