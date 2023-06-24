import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { SseModule } from 'src/sse/sse.module';
import { MessageController } from './message.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.MESSAGE,
          port: PORTS.MESSAGE,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.ORDER,
          port: PORTS.ORDER,
        },
      },
    ]),
    SseModule,
  ],
  controllers: [MessageController],
})
export class MessageModule {}
