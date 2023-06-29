import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ROLE } from 'src/auth/enums/role.enum';

@Injectable()
export class AreUserPrestationsAccessibles implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.params.userId;
    const profileOwner = await firstValueFrom(
      this.userService.send('getUserById', { id: userId }),
    );

    if (!profileOwner)
      throw new NotFoundException({ message: 'User not found' });

    if (profileOwner.roles.includes(ROLE.FREELANCER)) return true;
    return false;
  }
}
