import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModule } from 'src/quiz/quiz.module';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { Result, ResultSchema } from './schemas/result.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      {
        name: Result.name,
        schema: ResultSchema,
      },
    ]),
    forwardRef(() => QuizModule),
  ],
  controllers: [ResultController],
  providers: [ResultService],
  exports: [ResultService],
})
export class ResultModule {}
