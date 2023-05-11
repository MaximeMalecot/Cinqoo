import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('getHello')
  async getHello(): Promise<string> {
    const count = await this.appService.countReviews();

    return (
      this.appService.getHello() +
      `, there are currently ${count} reviews in the database`
    );
  }
}
