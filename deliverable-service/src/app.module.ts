import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Deliverable, DeliverableSchema } from './schemas/deliverable.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Deliverable.name, schema: DeliverableSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
