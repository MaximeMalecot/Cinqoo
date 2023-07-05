import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result } from './schemas/result.schema';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name) private readonly attemptModule: Model<Result>,
  ) {}

  public async getResults() {
    return await this.attemptModule.find();
  }

  public async getResultsOfUser(userId: string) {
    return await this.attemptModule.find({ userId });
  }

  public async getSuccessOfUser(userId: string) {
    const results = await this.attemptModule.find({ userId, success: true });
    return results;
  }

  public async canParticipateQuiz(userId: string, quizId: string) {
    const results = await this.attemptModule.find({ userId, quizId });
    return results.length === 0;
  }

  public saveResult(userId: string, quizId: string, points: number) {
    const result = new this.attemptModule({
      userId,
      quizId,
      score: points,
      success: points > 50,
    });
    return result.save();
  }
}
