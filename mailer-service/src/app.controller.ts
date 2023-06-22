import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('MAILER.HELLO')
  getHello() {
    return this.appService.getHello();
  }

  @EventPattern('MAILER.SEND')
  async sendMail(@Payload() data: SendMailDto) {
    return this.appService.sendMail(data);
  }
}
