import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
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

  @EventPattern('createUser')
  async createUser(@Payload() data: CreateUserDto) {
    return this.appService.createUser(data);
  }

  @UseGuards(OwnerOrAdminGards)
  @EventPattern('deleteUser')
  async removeUser(@Payload() data: { id: string }) {
    return this.appService.removeUser(data.id);
  }
}
