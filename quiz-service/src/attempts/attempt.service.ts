import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attempt } from './schemas/attempt.schema';

@Injectable()
export class AttemptService {
  constructor(
    @InjectModel(Attempt.name) private readonly attemptModule: Model<Attempt>,
  ) {}

  public async getAttempts() {
    return await this.attemptModule.find();
  }
}
