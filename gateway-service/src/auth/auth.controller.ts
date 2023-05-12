import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get()
  public getAuthHello() {
    return this.authService.send('getHello', {});
  }

  @Post('login')
  public async login(@Body(ValidationPipe) body: LoginDto) {
    try {
      return await firstValueFrom(this.authService.send('login', { ...body }));
    } catch (err) {
      throw new HttpException(err.message, err.code ?? 500);
    }
  }

  @Get('decode')
  public decodeToken() {
    return this.authService.send('decode_token', { token: 'HIHI' });
  }
}
