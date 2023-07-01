import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { CategorySeed } from './seeds/category.seed';
import { UserSeed } from './seeds/user.seed';

@Injectable()
export class SeedCommand {
  constructor(
    private readonly userSeeder: UserSeed,
    private readonly categorySeeder: CategorySeed,
  ) {}

  @Command({
    command: 'db:seed',
    describe: 'seed',
  })
  async seed() {
    await this.userSeeder.seed();
    await this.categorySeeder.seed();
  }
}
