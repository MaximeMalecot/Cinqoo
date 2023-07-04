import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './schemas/quiz.schema';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async getMsHello(): Promise<string> {
    const count = await this.quizModel.countDocuments();
    return `Hello from Quiz MS Service! There are ${count} quizzes in the database.`;
  }
}
