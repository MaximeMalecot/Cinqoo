import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateNoRestrictDto } from './dto/create-no-restrict.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePwdUserDto } from './dto/updatepwd-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('getUsers')
  getUsers() {
    return this.appService.getUsers();
  }

  @EventPattern('AUTH.GET_USER_BY_EMAIL')
  async authGetUser(@Payload() data: { email: string }) {
    return this.appService.authGetUser(data.email);
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

  @EventPattern('USER.PROMOTE_OR_DEMOTE')
  async promoteOrDemoteUserWithStripe(
    @Payload() data: { stripeAccountId: string; promote: boolean },
  ) {
    return this.appService.promoteOrDemoteUserWithStripe(
      data.stripeAccountId,
      data.promote,
    );
  }

  @EventPattern('USER.BECOME_FREELANCER')
  async becomeFreelancer(userId: string) {
    return this.appService.becomeFreelancer(userId);
  }

  @EventPattern('USER.GET_STRIPE_LINK')
  async getStripeLink(userId: string) {
    return this.appService.getStripeLink(userId);
  }

  @EventPattern('USER.GET_FREELANCER_PROFILE')
  async getFreelancerProfile(userId: string) {
    return this.appService.getFreelancerProfile(userId);
  }

  @EventPattern('USER.UPDATE_FREELANCER_PROFILE')
  async updateFreelancerProfile(
    @Payload()
    data: {
      id: string;
      freelancerProfileDto: UpdateFreelancerDto;
    },
  ) {
    return this.appService.updateFreelancerProfile(
      data.id,
      data.freelancerProfileDto,
    );
  }

  @EventPattern('USER.CREATE_NO_RESTRICT')
  async createNoRestrict(@Payload() data: CreateNoRestrictDto) {
    return this.appService.createNoRestrict(data);
  }
}
