import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { CreateReviewDto } from './dto/create-review.dto';
import { HasDoneOrderGuard } from './guards/has-done-order.guard';
import { PrestationExistsGuard } from './guards/prestation-exists.guard';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewService: ClientProxy,
  ) {}

  @UseGuards(PrestationExistsGuard)
  @Public()
  @Get(':prestationId/average')
  public getAverageForPrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.reviewService.send('REVIEW.GET_AVERAGE_ON_PRESTATION', {
      prestationId,
    });
  }

  @UseGuards(PrestationExistsGuard)
  @Public()
  @Get(':prestationId')
  public getReviewForPrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.reviewService.send('REVIEW.GET_PRESTATION', {
      prestationId,
    });
  }

  @UseGuards(PrestationExistsGuard)
  @UseGuards(HasDoneOrderGuard)
  @Post(':prestationId')
  public createReview(
    @Req() req,
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
    @Body() data: CreateReviewDto,
  ) {
    return this.reviewService.send('REVIEW.CREATE', {
      ...data,
      prestationId,
      userId: req.user._id,
    });
  }
}
