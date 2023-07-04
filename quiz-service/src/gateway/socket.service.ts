import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';
import { ROLE } from 'src/enums/role.enum';

@Injectable()
export class SocketService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  public async authenticate(bearer_token: string, socket: Socket) {
    try {
      const token = this.extractToken(bearer_token);
      const payload = await firstValueFrom(
        this.authService.send('decode_token', { token }),
      );
      if (!payload) {
        throw new WsException('Invalid token');
      }
      const user = await firstValueFrom(
        this.userService.send('getUserById', { id: payload.sub }),
      );
      if (!user) {
        throw new WsException('User not found');
      }
      // 💡 We're assigning the payload to the socket object here
      // so that we can access it in our event handlers
      if (
        !user.roles.includes(ROLE.ADMIN) &&
        !user.roles.includes(ROLE.FREELANCER)
      ) {
        throw new WsException('Forbidden ressource');
      }
      socket['user'] = user;
    } catch (err) {
      socket.emit('error', err.message);
      socket.disconnect();
    }
  }

  private extractToken(fullToken: string): string | undefined {
    const [type, token] = fullToken.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
