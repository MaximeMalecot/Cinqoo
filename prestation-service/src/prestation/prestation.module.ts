import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrestationController } from './prestation.controller';
import { PrestationService } from './prestation.service';
import { Prestation, PrestationSchema } from './schemas/prestation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prestation.name, schema: PrestationSchema },
    ]),
  ],
  controllers: [PrestationController],
  providers: [PrestationService],
})
export class PrestationModule {}
