import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { ReviewController } from './review.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REVIEW_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.REVIEW,
          port: PORTS.REVIEW,
        },
      },
      {
        name: 'PRESTATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PRESTATION,
          port: PORTS.PRESTATION,
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
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.AUTH,
          port: PORTS.AUTH,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.USER,
          port: PORTS.USER,
        },
      },
    ]),
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
