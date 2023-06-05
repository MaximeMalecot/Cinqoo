import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PAYMENT,
          port: PORTS.PAYMENT,
        },
      },
    ]),
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
