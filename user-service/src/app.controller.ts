import { Controller, Req } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { HidePassword } from './decorators/users.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('getHello')
  getHello(@Ctx() ctx) {
    ctx
      .getArgs()
      .sendRatflowIntercept({ event: 'HelloEvent', tag: 'HelloTag' });
    return this.appService.getHello();
  }

  @EventPattern('getUsers')
  getUsers(@Ctx() ctx) {
    ctx
      .getArgs()
      .sendRatflowIntercept({ event: 'HelloEvent', tag: 'HelloTag' });
    return this.appService.getUsers();
  }

  @EventPattern('getUserByEmail')
  getUserByEmail(@Payload() data: { email: string }) {
    return this.appService.getUserByEmail(data.email);
  }

  @HidePassword
  @EventPattern('createUser')
  async createUser(@Payload() data: CreateUserDto) {
    return this.appService.createUser(data);
  }
}
