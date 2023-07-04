import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuestionCreateDto } from './dto/question-create.dto';
import { QuestionUpdateDto } from './dto/question-update.dto';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { QuizUpdateDto } from './dto/quiz-update.dto';
import { Quiz } from './schemas/quiz.schema';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async getAll() {
    const quizzes = await this.quizModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          duration: 1,
          totalQuestions: {
            $cond: {
              if: { $isArray: '$questions' },
              then: { $size: '$questions' },
              else: 'NA',
            },
          },
        },
      },
    ]);
    return quizzes;
  }

  async getFullQuiz(quizId: string) {
    const quiz = await this.quizModel.findOne({
      _id: new Types.ObjectId(quizId),
    });
    return quiz;
  }

  async getFullQuestion(questionId: string) {
    const questions = await this.quizModel.aggregate([
      {
        $unwind: '$questions',
      },
      {
        $match: {
          'questions._id': new Types.ObjectId(questionId),
        },
      },
      {
        $project: {
          _id: '$questions._id',
          label: '$questions.label',
          answers: '$questions.answers',
        },
      },
    ]);
    return questions[0];
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
  async updateQuiz(quizId: string, data: QuizUpdateDto) {
    try {
      const quiz = await this.quizModel.findOne({
        _id: new Types.ObjectId(quizId),
      });
      if (!quiz)
        throw new RpcException({
          message: 'Quiz not found',
          statusCode: 404,
        });
      quiz.name = data.name;
      quiz.duration = data.duration;
      return await quiz.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async createQuestion(data: QuestionCreateDto) {
    try {
      console.log(data);
      const quiz = await this.quizModel.findOne({
        _id: new Types.ObjectId(data.quizId),
      });
      if (!quiz)
        throw new RpcException({
          message: 'Quiz not found',
          statusCode: 404,
        });
      let hasAtleastOneCorrect = false;
      data.answers.forEach((answer) => {
        if (answer.isRight === true) {
          hasAtleastOneCorrect = true;
        }
      });
      if (!hasAtleastOneCorrect)
        throw new RpcException({
          message: 'Atleast one answer must be correct',
          statusCode: 400,
        });
      quiz.questions.push({
        label: data.label,
        answers: data.answers,
      });
      return await quiz.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updateQuestion(questionId: string, data: QuestionUpdateDto) {
    const quiz = await this.quizModel.findOne({
      'questions._id': new Types.ObjectId(questionId),
    });
    if (!quiz)
      throw new RpcException({
        message: 'Question not found',
        statusCode: 404,
      });
    let hasAtleastOneCorrect = false;
    data.answers.forEach((answer) => {
      if (answer.isRight === true) {
        hasAtleastOneCorrect = true;
      }
    });
    if (!hasAtleastOneCorrect)
      throw new RpcException({
        message: 'Atleast one answer must be correct',
        statusCode: 400,
      });
    quiz.questions = quiz.questions.map((question) => {
      if (question._id.toString() === questionId) {
        return {
          ...question,
          ...data,
        };
      }
      return question;
    });
    return await quiz.save();
  }

  async deleteQuestion(questionId: string) {
    const quiz = await this.quizModel.findOne({
      'questions._id': new Types.ObjectId(questionId),
    });
    if (!quiz)
      throw new RpcException({
        message: 'Question not found',
        statusCode: 404,
      });
    quiz.questions = quiz.questions.filter(
      (question) => question._id.toString() !== questionId,
    );
    return await quiz.save();
  }
}
