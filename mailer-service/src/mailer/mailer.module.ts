import { DynamicModule, Module, Provider } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MAIL_CLIENT } from './constants';

export interface MailerModuleOptions {
  transporter: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: string;
}

@Module({})
export class SendMailModule {
  static forRoot({
    transporter: opts,
    ...rest
  }: MailerModuleOptions): DynamicModule {
    const transporter = nodemailer.createTransport(opts);
    const sendMail = async (mailOptions: nodemailer.SendMailOptions) => {
      return transporter.sendMail({
        from: rest.from,
        ...mailOptions,
      });
    };

    const sendMailProvider: Provider = {
      provide: MAIL_CLIENT,
      useValue: sendMail,
    };

    return {
      module: SendMailModule,
      providers: [sendMailProvider],
      exports: [sendMailProvider],
      global: true,
    };
  }
}
