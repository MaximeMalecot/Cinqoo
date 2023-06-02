import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "REVIEW_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "review-service",
          port: 3004
        }
      }
    ])
  ],
  controllers: [ReviewController]
})
export class ReviewModule {}
