import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HasDoneOrderGuard implements CanActivate {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { prestationId } = req.params;
    const hasDone = await firstValueFrom(
      this.orderService.send('ORDER.HAS_DONE', {
        applicant: req.user._id,
        serviceId: prestationId,
      }),
    );

    return hasDone;
  }
}
