import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PORTS, SERVICES } from './constants';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'PRESTATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PRESTATION,
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PAYMENT,
        },
      },
      {
        name: 'MAILER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.MAILER,
        },
      },
      {
        name: 'HYBRID_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.HYBRID,
          port: PORTS.HYBRID_MS,
        },
      },
    ]),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
