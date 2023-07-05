import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result } from './schemas/result.schema';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name) private readonly resultModel: Model<Result>,
  ) {}

  public async getResults() {
    return await this.resultModel.find();
  }

  public async getResultsOfUser(userId: string) {
    return await this.resultModel.find({ userId });
  }

  public async getSuccessOfUser(userId: string) {
    const results = await this.resultModel.find({ userId, success: true });
    return results;
  }

  public async canParticipateQuiz(userId: string, quizId: string) {
    console.log(userId, quizId);
    const results = await this.resultModel.findOne({ userId, quizId });
    return results;
  }

  public saveResult(userId: string, quizId: string, points: number) {
    const result = new this.resultModel({
      userId,
      quizId,
      score: points,
      success: points > 50,
    });
    return result.save();
  }
}
