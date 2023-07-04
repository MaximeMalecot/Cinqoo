import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';
import { Attempt, AttemptSchema } from './schemas/attempt.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      {
        name: Attempt.name,
        schema: AttemptSchema,
      },
    ]),
  ],
  controllers: [AttemptController],
  providers: [AttemptService],
  exports: [AttemptService],
})
export class AttemptModule {}
