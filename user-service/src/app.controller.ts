import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePwdUserDto } from './dto/updatepwd-user.dto';

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
  async getUserByEmail(@Payload() data: { email: string }) {
    return this.appService.getUserByEmail(data.email);
  }

  @EventPattern('getUserById')
  async getUserById(@Payload() data: { id: string }) {
    return this.appService.getUserById(data.id);
  }

  @EventPattern('createUser')
  async createUser(@Payload() data: CreateUserDto) {
    return this.appService.createUser(data);
  }

  @EventPattern('updateUser')
  async updateUser(
    @Payload() data: { userId: string; updateUserDto: UpdateUserDto },
  ) {
    return this.appService.updateUser(data.userId, data.updateUserDto);
  }

  @EventPattern('updatePwdUser')
  async updatePwdUser(
    @Payload() data: { userId: string; updatePwdUser: UpdatePwdUserDto },
  ) {
    return this.appService.updatePwdUser(data.userId, data.updatePwdUser);
  }

  @EventPattern('deleteUser')
  async removeUser(userId: string) {
    return this.appService.removeUser(userId);
  }
}
