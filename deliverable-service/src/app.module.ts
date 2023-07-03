import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PORTS, SERVICES } from './constants';
import { Deliverable, DeliverableSchema } from './schemas/deliverable.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'MAILER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.MAILER,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.ORDER,
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
      { name: Deliverable.name, schema: DeliverableSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
