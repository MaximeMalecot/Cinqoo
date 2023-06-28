import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewExistsDto } from './dto/review-exists.dto';
import { Review, ReviewDocument } from './schema/review.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async getForPrestation(prestationId: string): Promise<ReviewDocument[]> {
    return await this.reviewModel.find({ prestationId: prestationId }).exec();
  }

  async createReview(data: CreateReviewDto) {
    const reviewExists = await this.exists({
      prestationId: data.prestationId,
      userId: data.userId,
    });
    if (reviewExists)
      throw new RpcException({
        statusCode: 403,
        message: 'You have already reviewed this prestation',
      });
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

  async getAverageOnPrestation(prestationId: string) {
    const reviewsCount = await this.reviewModel.countDocuments({
      prestationId: prestationId,
    });

    const reviews = await this.reviewModel.aggregate([
      {
        $match: {
          prestationId: prestationId,
        },
      },
      {
        $group: {
          _id: null,
          average: {
            $avg: '$mark',
          },
        },
      },
    ]);

    return {averageMark: reviews[0]?.average??0, reviewsCount: reviewsCount};
  }
}
