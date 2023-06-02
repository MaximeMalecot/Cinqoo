import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('favorite')
export class FavoriteController {
  constructor(
    @Inject('FAVORITE_SERVICE')
    private readonly favoriteService: ClientProxy,
  ) {}

  @Get()
  public getFavoriteHello() {
    return this.favoriteService.send('getHello', {});
  }
}
