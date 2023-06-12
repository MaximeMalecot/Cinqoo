import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRESTATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PRESTATION,
          port: PORTS.PRESTATION,
        },
      },
    ]),
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
