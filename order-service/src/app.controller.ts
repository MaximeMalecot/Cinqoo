import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('getHello')
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @EventPattern('ORDER.CREATE')
  async createOrder(@Payload() data: any) {
    return await this.appService.createOrder(data);
  }

  @EventPattern('ORDER.GET_ORDERS_OF_USER')
  async getOrdersByUser(userId: string) {
    return await this.appService.getOrdersOfUser(userId);
  }
}
