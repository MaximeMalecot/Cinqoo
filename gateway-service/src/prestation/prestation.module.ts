import { Module } from '@nestjs/common';
import { PrestationController } from './prestation.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRESTATION_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'prestation-service',
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [PrestationController],
})
export class PrestationModule {}
