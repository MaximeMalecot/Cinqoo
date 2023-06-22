import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { SendMailDto } from './dto/send-mail.dto';

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
  public sendMail(@Body() data: SendMailDto) {
    return this.mailerService.send('MAILER.SEND', data);
  }
}
