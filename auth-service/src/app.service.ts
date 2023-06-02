import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { secret } from './constants';
import { JsonWebTokenError } from 'jsonwebtoken';

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
          statusCode: 404,
        });
      }
      if (!compareSync(data.password, user.password)) {
        throw new RpcException({
          message: "Email or password don't match",
          statusCode: 400,
        });
      }
      const payload = {
        sub: user._id,
        username: user.username,
        email: user.email,
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
        statusCode: 500,
      });
    }
  }

  async decodeToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      return payload;
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }
      if (err instanceof JsonWebTokenError) {
        throw new RpcException({
          message: err.message,
          statusCode: 401,
        });
      }
      throw new RpcException({
        message: err.message,
        statusCode: 500,
      });
    }
  }
}
