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
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Get()
  public getUserHello() {
    return this.userService.send('getHello', {});
  }

  @Post()
  public async createUser(@Body(ValidationPipe) body: CreateUserDto) {
    try {
      let user = await firstValueFrom(
        this.userService.send('createUser', { ...body }),
      );
      return user;
    } catch (err) {
      throw new HttpException(err.message, err.code ?? 500);
    }
  }
}
