import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { AppService } from 'src/app.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OwnerOrAdminGards implements CanActivate {
  constructor(private userService: AppService, private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { id, sub: user } = ctx.switchToRpc().getData();
    if (!user)
      throw new RpcException({ message: 'User missing', statusCode: 401 });
    const requestedUser = await this.userService.getUserById(id);
    if (!requestedUser)
      throw new RpcException({ message: 'User not found', statusCode: 404 });
    return user.id === id || user.roles.includes(Role.ADMIN);
  }
}
