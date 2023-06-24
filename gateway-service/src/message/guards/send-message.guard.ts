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
export class SendMessageGuard implements CanActivate {
  private validStatus = ['PENDING', 'IN_PROGRESS', 'TERMINATED'];
  constructor(
    private reflector: Reflector,
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    const orderId = context.switchToHttp().getRequest().body.orderId;
    if (!orderId || !ObjectId.isValid(orderId))
      throw new BadRequestException('Invalid order id');
    const { order, users } = await firstValueFrom(
      this.orderService.send('ORDER.GET_USERS', orderId),
    );
    if (!order) throw new NotFoundException({ message: 'Order not found' });
    if (!users.includes(user._id)) return false;
    if (!this.validStatus.includes(order.status))
      throw new BadRequestException('Order status is invalid');
    return true;
  }
}
