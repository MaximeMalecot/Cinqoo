import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Command } from 'nestjs-command';
import { firstValueFrom } from 'rxjs';
import { ROLE } from 'src/auth/enums/role.enum';
import { CreateNoRestrictDto } from 'src/user/dto/create-no-restrict.dto';

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

    let users: Array<CreateNoRestrictDto> = [
      {
        username: 'user-test',
        email: 'user@test.com',
        password: 'User123+=',
        roles: [ROLE.USER],
      },
      {
        username: 'admin-test',
        email: 'admin@test.com',
        password: 'Admin123+=',
        roles: [ROLE.USER, ROLE.ADMIN],
      },
    ];
    for (let i = 0; i < users.length; i++) {
      let tmpUser = await firstValueFrom(
        this.userService.send('USER.CREATE_NO_RESTRICT', users[i]),
      );
      console.log(`Created user with id: ${tmpUser._id}`);
    }
  }
}
