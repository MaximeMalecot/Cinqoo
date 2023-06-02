import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'payment-service',
          port: 3006,
        },
      },
    ]),
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
