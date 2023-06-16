import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ROLE } from 'src/auth/enums/role.enum';

@Injectable()
export class IsServiceOwner implements CanActivate {
  constructor(
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    if (user.roles.includes(ROLE.ADMIN)) return true;
    const prestationId = context.switchToHttp().getRequest()
      .params.prestationId;
    const prestation = await firstValueFrom(
      this.prestationService.send('PRESTATION.GET_ONE', {
        id: prestationId,
      }),
    );
    if (!prestation)
      throw new NotFoundException({ message: 'Prestation not found' });
    if (prestation.owner !== user.id) return false;
    return true;
  }
}
