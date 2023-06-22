import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(
    @Inject('MAILER_SERVICE')
    private readonly mailerService: ClientProxy,
  ) {}

  @Get()
  public getMailereHello() {
    return this.mailerService.send('MAILER.HELLO', {});
  }
}
