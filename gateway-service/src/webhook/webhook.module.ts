import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STRIPE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.STRIPE,
          port: PORTS.STRIPE,
        },
      },
    ]),
  ],
  controllers: [WebhookController],
})
export class WebhookModule {}
