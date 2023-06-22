import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PrestationExistsGuard implements CanActivate {
  constructor(
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { prestationId } = context.switchToHttp().getRequest().params;
    if (!prestationId) return false;
    const prestation = await firstValueFrom(
      this.prestationService.send('PRESTATION.GET_ONE', {
        id: prestationId,
      }),
    );
    if (!prestation)
      throw new NotFoundException({ message: 'Prestation not found' });
    return true;
  }
}
