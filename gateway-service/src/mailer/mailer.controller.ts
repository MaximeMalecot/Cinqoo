import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { SendInformativeMailDto } from './dto/send-informative-mail.dto';
import { SendRedirectMailDto } from './dto/send-redirect-mail.dto';

@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(
    @Inject('MAILER_SERVICE')
    private readonly mailerService: ClientProxy,
  ) {}

  @Get()
  public getMailerHello() {
    return this.mailerService.send('MAILER.HELLO', {});
  }

  @Post()
  public sendMail(@Body() data: SendInformativeMailDto) {
    return this.mailerService.send('MAILER.SEND_INFORMATIVE_MAIL', data);
  }

  @Post('redirect')
  public sendRedirectMail(@Body() data: SendRedirectMailDto) {
    return this.mailerService.send('MAILER.SEND_REDIRECT_MAIL', data);
  }
}
