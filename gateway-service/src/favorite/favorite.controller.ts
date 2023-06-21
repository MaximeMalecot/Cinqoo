import { Controller, Get, Inject, Param, Put, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';

@ApiTags('favorite')
@Controller('favorite')
export class FavoriteController {
  constructor(
    @Inject('FAVORITE_SERVICE')
    private readonly favoriteService: ClientProxy,
  ) {}

  @Get()
  public getFavoriteHello(@Req() req) {
    return this.favoriteService.send('getSelfFavorites', {
      userId: req.user._id,
    });
  }

  @Put(':prestationId')
  public addOrDeleteFavorite(
    @Req() req,
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.favoriteService.send('addOrDeleteFavorite', {
      prestationId,
      userId: req.user._id,
    });
  }
}
