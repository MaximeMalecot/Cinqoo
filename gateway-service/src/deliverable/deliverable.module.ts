import { Module } from '@nestjs/common';
import { DeliverableController } from './deliverable.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';

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
    ]),
  ],
  controllers: [DeliverableController],
})
export class DeliverableModule {}
