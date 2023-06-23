import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { MailerController } from './mailer.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAILER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.MAILER,
          port: PORTS.MAILER,
        },
      },
    ]),
  ],
  controllers: [MailerController],
})
export class MailerModule {}
