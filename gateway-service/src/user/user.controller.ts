import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePwdUserDto } from './dto/updatepwd-user.dto';

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

  @Get('self')
  public getUserSelf(@Req() req) {
    return this.userService.send('getUserById', {
      id: req.user._id,
    });
  }

  @Get(':userId')
  public getUserById(@Param('userId', CheckObjectIdPipe) userId: string) {
    return this.userService.send('getUserById', {
      id: userId,
    });
  }

  @HttpCode(200)
  @Patch(':userId')
  public async updateUser(
    @Param('userId', CheckObjectIdPipe) userId: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.send('updateUser', {
      userId,
      updateUserDto: body,
    });
  }

  @HttpCode(200)
  @Patch('/pwd/:userId')
  public async updatePwdUser(
    @Param('userId', CheckObjectIdPipe) userId: string,
    @Body() body: UpdatePwdUserDto,
  ) {
    return this.userService.send('updatePwdUser', {
      userId,
      updatePwdUser: body,
    });
  }

  @HttpCode(204)
  @Delete(':userId')
  public async deleteUser(@Param('userId', CheckObjectIdPipe) userId: string) {
    return this.userService.send('deleteUser', userId);
  }
}
