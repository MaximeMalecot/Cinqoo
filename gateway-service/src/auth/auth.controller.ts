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
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Get('auth')
  public getAuthHello() {
    return this.authService.send('getHello', {});
  }

  @Public()
  @Post('login')
  public async login(@Body(ValidationPipe) body: LoginDto) {
    return await firstValueFrom(this.authService.send('login', { ...body }));
  }

  @Public()
  @Post('register')
  public async createUser(@Body(ValidationPipe) body: CreateUserDto) {
    return await firstValueFrom(
      this.userService.send('createUser', { ...body }),
    );
  }
}
