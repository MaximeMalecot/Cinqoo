import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { SendInformativeMailDto } from './dto/send-informative-mail.dto';
import { SendRedirectMailDto } from './dto/send-redirect-mail.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('MAILER.HELLO')
  getHello() {
    return this.appService.getHello();
  }

  @EventPattern('MAILER.SEND_INFORMATIVE_MAIL')
  async sendInformativeMail(@Payload() data: SendInformativeMailDto) {
    return this.appService.sendInformativeMail(data);
  }

  @EventPattern('MAILER.SEND_REDIRECT_MAIL')
  async sendRedirectMail(@Payload() data: SendRedirectMailDto) {
    return this.appService.sendRedirectMail(data);
  }
}
