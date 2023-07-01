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
import { ROLE } from 'src/auth/enums/role.enum';

@Injectable()
export class IsInOrderGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    if (user.roles.includes(ROLE.ADMIN)) return true;
    const orderId = context.switchToHttp().getRequest().params.orderId;
    const order = await firstValueFrom(
      this.orderService.send('ORDER.GET_ORDER', orderId),
    );
    if (!order) throw new NotFoundException({ message: 'Order not found' });
    const prestation = await firstValueFrom(
      this.prestationService.send('PRESTATION.GET_ONE', {
        id: order.serviceId,
      }),
    );
    if (order.applicant !== user._id && prestation.owner !== user._id)
      return false;
    return true;
  }
}
