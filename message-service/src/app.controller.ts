import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('MESSAGE.HELLO')
  async getHello() {
    return this.appService.getHello();
  }

  @EventPattern('MESSAGE.GET_MESSAGES_BY_ORDER')
  async getMessagesByOrder(@Payload() orderId: string) {
    return await this.appService.getMessagesByOrder(orderId);
  }

  @EventPattern('MESSAGE.SEND_MESSAGE')
  async sendMessage(@Payload() data: SendMessageDto) {
    return await this.appService.sendMessage(data);
  }
}
