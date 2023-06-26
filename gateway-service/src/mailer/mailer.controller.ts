import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
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
  @Roles(ROLE.ADMIN)
  public getMailerHello() {
    return this.mailerService.send('MAILER.HELLO', {});
  }

  @Post()
  @Roles(ROLE.ADMIN)
  public sendMail(@Body() data: SendInformativeMailDto) {
    return this.mailerService.send('MAILER.SEND_INFORMATIVE_MAIL', data);
  }

  @Post('redirect')
  @Roles(ROLE.ADMIN)
  public sendRedirectMail(@Body() data: SendRedirectMailDto) {
    return this.mailerService.send('MAILER.SEND_REDIRECT_MAIL', data);
  }
}
