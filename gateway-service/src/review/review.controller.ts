import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewService: ClientProxy,
  ) {}

  @Get()
  public getReviewHello() {
    return this.reviewService.send('getHello', {});
  }
}
