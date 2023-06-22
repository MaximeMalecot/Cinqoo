import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendMailDto } from './dto/send-mail.dto';
import { MAIL_CLIENT } from './mailer/constants';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    @Inject(MAIL_CLIENT) private readonly sendMailClient: Function,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async sendMail(data: SendMailDto) {
    try {
      const { email: to } = await this.getUser(data.targetId);

      const res = await this.sendMailClient({
        to,
        subject: 'SUJET',
        text: 'TEXTE',
      });
      return res.messageId;
    } catch (err) {
      console.log('err:', err);
      return err;
    }
  }

  async getUser(id: string) {
    return await firstValueFrom(this.userService.send('getUserById', { id }));
  }
}
