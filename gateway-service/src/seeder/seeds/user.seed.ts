import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Command } from 'nestjs-command';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserSeed {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Command({
    command: 'db:seed:user',
    describe: 'seed users',
  })
  async seed() {
    console.log('SEEDING USERS -----');
    let user = {
      username: 'userTEST',
      email: 'userTEST@userTEST.com',
      password: 'User123+',
      roles: ['USER'],
    };
    let admin = {
      username: 'adminTEST',
      email: 'adminTEST@adminTEST.com',
      password: 'Admin123+',
      roles: ['USER', 'ADMIN'],
    };

    let usersData = [user, admin];
    for (let i = 0; i < usersData.length; i++) {
      let tmpUser = await firstValueFrom(
        this.userService.send('USER.CREATE_NO_RESTRICT', usersData[i]),
      );
      console.log(`Created user with id: ${tmpUser._id}`);
    }
  }
}
