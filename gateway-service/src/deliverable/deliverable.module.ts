import { Module } from '@nestjs/common';
import { DeliverableController } from './deliverable.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DELIVERABLE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'deliverable-service',
          port: 3008,
        },
      },
    ]),
  ],
  controllers: [DeliverableController],
})
export class DeliverableModule {}
