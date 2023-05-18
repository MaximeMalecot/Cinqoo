import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decator';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }
    try {
      const payload = await firstValueFrom(
        this.authService.send('decode_token', { token }),
      );
      if (!payload) {
        console.log('no payload');
        throw new UnauthorizedException('Invalid token');
      }
      const user = await firstValueFrom(
        this.userService.send('getUserById', { id: payload.sub }),
      );
      if (!user) {
        console.log('no user');
        throw new NotFoundException('User not found');
      }
      console.log(user);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.message && err.code) {
        throw new HttpException(err.message, err.code);
      }
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
