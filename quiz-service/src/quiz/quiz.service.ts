import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { Quiz } from './schemas/quiz.schema';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async getMsHello(): Promise<string> {
    const count = await this.quizModel.countDocuments();
    return `Hello from Quiz MS Service! There are ${count} quizzes in the database.`;
  }

  async createQuiz(data: QuizCreateDto) {
    try {
      const quiz = new this.quizModel(data);
      return await quiz.save();
    } catch (error) {
      if (error.code === 11000)
        throw new RpcException({
          message: 'Quiz already exists',
          statusCode: 400,
        });
      throw new RpcException(error.message);
    }
  }
}
