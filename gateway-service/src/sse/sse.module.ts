import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.ORDER,
          port: PORTS.ORDER,
        },
      },
    ]),
  ],
  controllers: [SseController],
  providers: [SseService],
})
export class SseModule {}
