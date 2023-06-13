import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

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
