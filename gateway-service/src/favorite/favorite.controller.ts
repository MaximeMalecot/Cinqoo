import {
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { PrestationExistsGuard } from './guards/prestation-exists.guard';

@ApiTags('favorite')
@Controller('favorite')
export class FavoriteController {
  constructor(
    @Inject('FAVORITE_SERVICE')
    private readonly favoriteService: ClientProxy,
  ) {}

  @Get()
  public getFavoriteHello(@Req() req) {
    return this.favoriteService.send('FAVORITE.GET_SELF', {
      userId: req.user._id,
    });
  }

  @UseGuards(PrestationExistsGuard)
  @Put(':prestationId')
  public addOrDeleteFavorite(
    @Req() req,
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.favoriteService.send('FAVORITE.PUT', {
      prestationId,
      userId: req.user._id,
    });
  }
}
