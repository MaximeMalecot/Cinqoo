import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/decorators/public.decator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Get()
  public getUserHello(@Req() req) {
    return this.userService.send('getHello', {
      ...req['clientData'],
    });
  }

  @Get('test')
  public getUserTest() {
    return this.userService.send('getUsers', {});
  }

  @Public()
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
