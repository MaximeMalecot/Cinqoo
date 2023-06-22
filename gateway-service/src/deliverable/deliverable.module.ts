import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { DeliverableController } from './deliverable.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DELIVERABLE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.DELIVERABLE,
          port: PORTS.DELIVERABLE,
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
  ],
  controllers: [DeliverableController],
})
export class DeliverableModule {}
