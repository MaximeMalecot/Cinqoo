import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { UpdateRequestDto } from './dto/update-request.dto';

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

  @EventPattern('ORDER.GET_ORDER')
  async getOrder(orderId: string) {
    return await this.appService.getOrder(orderId);
  }

  @EventPattern('ORDER.GET_ALL_ORDERS')
  async getAllOrder() {
    console.log('get all orders');
    return await this.appService.getAllOrders();
  }

  @EventPattern('ORDER.GET_ORDERS_OF_USER')
  async getOrdersByUser(userId: string) {
    return await this.appService.getOrdersOfUser(userId);
  }

  // Requests

  @EventPattern('ORDER.GET_PENDING_REQUESTS')
  async getPendingRequest(@Payload() userId: string) {
    return await this.appService.getPendingRequests(userId);
  }

  @EventPattern('ORDER.ACCEPT_REQUEST')
  async acceptRequest(@Payload() data: UpdateRequestDto) {
    return await this.appService.acceptRequest(data);
  }

  @EventPattern('ORDER.REFUSE_REQUEST')
  async refuseRequest(@Payload() data: UpdateRequestDto) {
    return await this.appService.refuseRequest(data);
  }
}
