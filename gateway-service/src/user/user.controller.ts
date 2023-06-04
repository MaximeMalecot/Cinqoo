import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Post,
  Req,
  ValidationPipe,
  Param,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

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

  @HttpCode(204)
  @Delete(':id')
  public async deleteUser(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    await firstValueFrom(
      this.userService.send('deleteUser', { id, sub: req.user }),
    );
    return null;
  }
}
