import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { SERVICES } from 'src/constants';
import { PrestationController } from './prestation.controller';
import { PrestationService } from './prestation.service';
import { Prestation, PrestationSchema } from './schemas/prestation.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'STRIPE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.STRIPE,
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: Prestation.name, schema: PrestationSchema },
    ]),
  ],
  controllers: [PrestationController],
  providers: [PrestationService],
})
export class PrestationModule {}
