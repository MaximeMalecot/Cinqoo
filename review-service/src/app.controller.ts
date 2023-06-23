import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewExistsDto } from './dto/review-exists.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { ReviewDocument } from './schema/review.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('REVIEW.GET_PRESTATION')
  async getForPrestation(
    @Payload() data: ReviewRequestDto,
  ): Promise<ReviewDocument[]> {
    return await this.appService.getForPrestation(data.prestationId);
  }

  @EventPattern('REVIEW.CREATE')
  async createReview(@Payload() data: CreateReviewDto) {
    return await this.appService.createReview(data);
  }

  @EventPattern('REVIEW.EXISTS')
  async exists(@Payload() data: ReviewExistsDto) {
    return await this.appService.exists(data);
  }

  @EventPattern('REVIEW.GET_AVERAGE_ON_PRESTATION')
  async getAverageOnPrestation(@Payload('prestationId') prestationId: string) {
    return await this.appService.getAverageOnPrestation(prestationId);
  }
}
