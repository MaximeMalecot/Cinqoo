import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from 'src/category/category.module';
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
    forwardRef(() => CategoryModule),
  ],
  controllers: [PrestationController],
  providers: [PrestationService],
  exports: [PrestationService],
})
export class PrestationModule {}
