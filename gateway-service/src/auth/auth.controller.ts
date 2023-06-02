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
import { Public } from './decorators/public.decator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get()
  public getAuthHello() {
    return this.authService.send('getHello', {});
  }

  @Public()
  @Post('login')
  public async login(@Body(ValidationPipe) body: LoginDto) {
    return await firstValueFrom(this.authService.send('login', { ...body }));
  }
}
