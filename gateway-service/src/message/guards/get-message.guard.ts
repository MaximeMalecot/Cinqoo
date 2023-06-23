import {
  BadRequestException,
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

@Injectable()
export class GetMessageGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    const orderId = context.switchToHttp().getRequest().params.orderId;
    if (!orderId || !ObjectId.isValid(orderId))
      throw new BadRequestException('Invalid order id');
    const order = await firstValueFrom(
      this.orderService.send('ORDER.GET_USERS', orderId),
    );
    if (!order) throw new NotFoundException({ message: 'Order not found' });
    if (user.roles.includes('ADMIN')) return true;
    if (!order.users.includes(user._id)) return false;
    return true;
  }
}
