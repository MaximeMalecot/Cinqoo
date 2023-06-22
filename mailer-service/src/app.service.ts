import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async sendMail(data: SendMailDto) {
    try {
      const { email: to } = await this.getUser(data.targetId);

      return {
        to,
        subject: data.subject,
        text: data.text,
      };
    } catch (err) {
      return err;
    }
  }

  async getUser(id: string) {
    return await firstValueFrom(this.userService.send('getUserById', { id }));
  }
}
