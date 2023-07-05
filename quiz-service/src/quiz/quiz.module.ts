import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultModule } from 'src/results/result.module';
import { QuizController } from './quiz.controler';
import { QuizService } from './quiz.service';
import { Quiz, QuizSchema } from './schemas/quiz.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    forwardRef(() => ResultModule),

  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
