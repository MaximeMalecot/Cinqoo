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
}
