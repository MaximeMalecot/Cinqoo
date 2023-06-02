import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async getHello(): Promise<string> {
    const count = await this.reviewModel.countDocuments();
    return `Review service! There are currently ${count} reviews in the database`;
  }
}
