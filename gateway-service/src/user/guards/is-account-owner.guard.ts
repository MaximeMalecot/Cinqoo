import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ROLE } from 'src/auth/enums/role.enum';

@Injectable()
export class IsAccountOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    if (user.roles.includes(ROLE.ADMIN)) return true;
    const userId = context.switchToHttp().getRequest().params.userId;
    if (userId === user._id) return true;
    return false;
  }
}
