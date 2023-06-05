import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';

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
    ]),
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
