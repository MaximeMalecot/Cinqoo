import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { firstValueFrom } from 'rxjs';
import { SendInformativeMailDto } from './dto/send-informative-mail.dto';
import { SendRedirectMailDto } from './dto/send-redirect-mail.dto';
import { MAIL_CLIENT } from './mailer/constants';

@Injectable()
export class AppService {
  informativeTemplate: string;
  redirectTemplate: string;

  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    @Inject(MAIL_CLIENT) private readonly sendMailClient: Function,
  ) {
    const informativeTemplate = fs.readFileSync(
      'src/templates/informative.hbs',
      'utf8',
    );
    const redirectTemplate = fs.readFileSync(
      'src/templates/redirect.hbs',
      'utf8',
    );
    this.informativeTemplate = informativeTemplate;
    this.redirectTemplate = redirectTemplate;
  }

  getHello(): string {
    return 'Hello World!';
  }

  async sendInformativeMail(data: SendInformativeMailDto) {
    try {
      const { email: to } = await this.getUser(data.targetId);

      const compiledTemplate = Handlebars.compile(this.informativeTemplate);
      const html = compiledTemplate({
        recipient: to,
        subject: data.subject,
        text: data.text,
        now: new Date().toLocaleDateString(),
      });

      const res = await this.sendMailClient({
        to,
        subject: data.subject,
        html,
      });

      return res.messageId;
    } catch (err) {
      if (err.statusCode && err.message) {
        throw new RpcException({
          statusCode: err.statusCode,
          message: err.message,
        });
      }
      throw new RpcException({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  async sendRedirectMail(data: SendRedirectMailDto) {
    try {
      const { email: to } = await this.getUser(data.targetId);

      const compiledTemplate = Handlebars.compile(this.redirectTemplate);
      const html = compiledTemplate({
        recipient: to,
        subject: data.subject,
        text: data.text,
        redirectUrl: data.redirectUrl,
        label: data.label.toUpperCase(),
        now: new Date().toLocaleDateString(),
      });

      const res = await this.sendMailClient({
        to,
        subject: data.subject,
        html,
      });

      return res.messageId;
    } catch (err) {
      if (err.statusCode && err.message) {
        throw new RpcException({
          statusCode: err.statusCode,
          message: err.message,
        });
      }
      throw new RpcException({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  async getUser(id: string) {
    return await firstValueFrom(this.userService.send('getUserById', { id }));
  }
}
