import { Controller, Req, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { HidePassword } from './decorators/users.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { OwnerOrAdminGards } from './guards/user.guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('getHello')
  getHello() {
    return this.appService.getHello();
  }

  @EventPattern('getUsers')
  getUsers() {
    return this.appService.getUsers();
  }

  @EventPattern('getUserByEmail')
  getUserByEmail(@Payload() data: { email: string }) {
    return this.appService.getUserByEmail(data.email);
  }

  @EventPattern('getUserById')
  getUserById(@Payload() data: { id: string }) {
    return this.appService.getUserById(data.id);
  }

  @HidePassword
  @EventPattern('createUser')
  async createUser(@Payload() data: CreateUserDto) {
    return this.appService.createUser(data);
  }

  @UseGuards(OwnerOrAdminGards)
  @EventPattern('deleteUser')
  async deleteUser(@Payload() data: { id: string }) {
    console.log('onéla');
    return this.appService.deleteUser(data.id);
  }
}
