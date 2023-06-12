import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { PrestationModule } from './prestation/prestation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    PrestationModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
