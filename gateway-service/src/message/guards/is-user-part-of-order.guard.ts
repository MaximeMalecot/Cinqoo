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
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IsUserPartOfOrderGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('MESSAGE GUARD');
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    const orderId =
      context.switchToHttp().getRequest().body.orderId ??
      context.switchToHttp().getRequest().params.orderId;
    console.log(orderId);
    const users = await firstValueFrom(
      this.orderService.send('ORDER.GET_USERS', orderId),
    );
    if (!users) throw new NotFoundException({ message: 'Order not found' });
    if (!users.includes(user._id)) return false;
    return true;
  }
}
