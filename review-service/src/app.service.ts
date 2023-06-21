import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewExistsDto } from './dto/review-exists.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { Review, ReviewDocument } from './schema/review.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async getForPrestation(prestationId: string): Promise<ReviewDocument[]> {
    return await this.reviewModel.find({ prestationId: prestationId }).exec();
  }

  async createReview(data: ReviewRequestDto) {
    const review = new this.reviewModel({
      ...data,
    });
    return await review.save();
  }

  async exists(data: ReviewExistsDto) {
    const review = await this.reviewModel.findOne({
      prestationId: data.prestationId,
      userId: data.userId,
    });
    return review ? true : false;
  }
}
