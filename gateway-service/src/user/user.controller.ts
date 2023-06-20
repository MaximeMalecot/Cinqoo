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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePwdUserDto } from './dto/updatepwd-user.dto';
import { IsAccountOwnerGuard } from './guards/is-account-owner.guard';

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
  @Public()
  public getUserById(@Param('userId', CheckObjectIdPipe) userId: string) {
    return this.userService.send('getUserById', {
      id: userId,
    });
  }

  @HttpCode(200)
  @Patch(':userId')
  @UseGuards(IsAccountOwnerGuard)
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
  @UseGuards(IsAccountOwnerGuard)
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
  @UseGuards(IsAccountOwnerGuard)
  @Delete(':userId')
  public async deleteUser(@Param('userId', CheckObjectIdPipe) userId: string) {
    return this.userService.send('deleteUser', userId);
  }

  @Get('self/become-freelancer')
  public becomeFreelancer(@Req() req: any) {
    return this.userService.send('USER.BECOME_FREELANCER', req.user._id);
  }
}
