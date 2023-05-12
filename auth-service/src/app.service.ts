import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Auth service';
  }

  async login(data: LoginDto) {
    try {
      const user = await firstValueFrom(
        this.userService.send('getUserByEmail', {
          email: data.email,
        }),
      );
      if (!user) {
        throw new RpcException({
          message: "Email or password don't match",
          code: 404,
        });
      }
      if (!compareSync(data.password, user.password)) {
        throw new RpcException({
          message: "Email or password don't match",
          code: 400,
        });
      }
      const payload = {
        sub: user.id,
        username: user.username,
        roles: user.roles,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }
      throw new RpcException({
        message: err.message,
        code: 500,
      });
    }
  }

  decodeToken(token: string): any {
    return `decode ${token}`;
  }
}
