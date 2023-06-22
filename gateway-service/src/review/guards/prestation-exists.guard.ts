import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { firstValueFrom } from 'rxjs';
import { ROLE } from 'src/auth/enums/role.enum';

@Injectable()
export class PrestationExistsGuard implements CanActivate {
  constructor(
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { prestationId } = request.params;
    if (!prestationId || !ObjectId.isValid(prestationId)) return false;
    const prestation = await firstValueFrom(
      this.prestationService.send('PRESTATION.GET_ONE', {
        id: prestationId,
      }),
    );
    if (!prestation)
      throw new NotFoundException({ message: 'Prestation not found' });
    if (prestation.isActive) return true;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }
    let user = null;
    try {
      const payload = await firstValueFrom(
        this.authService.send('decode_token', { token }),
      );
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
      user = await firstValueFrom(
        this.userService.send('getUserById', { id: payload.sub }),
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.message && err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      }
      throw new UnauthorizedException('Invalid token');
    }

    if (user.roles.includes(ROLE.ADMIN)) return true;
    if (prestation.owner === user._id) return true;
    return false;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
