import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { PublishRequestDto } from './dto/publish-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('DELIVERABLE.GET_ALL_FOR_ORDER')
  async getAllDeliverablesForAnOrder(orderId: string) {
    return await this.appService.getAllDeliverablesForAnOrder(orderId);
  }

  @EventPattern('DELIVERABLE.PUBLISH_FOR_ORDER')
  async publishDeliverable(data: PublishRequestDto) {
    const { orderId, ...rest } = data;
    return await this.appService.publishDeliverable(orderId, rest);
  }
}
