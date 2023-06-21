import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  FavoriteRequestDto,
  FavoriteResultDto,
  GetFavoritesDto,
} from './dto/favorite-express.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('addOrDeleteFavorite')
  async addOrDeleteFavorite(
    @Payload() data: FavoriteRequestDto,
  ): Promise<FavoriteResultDto> {
    return await this.appService.addOrDeleteFavorite(data);
  }

  @EventPattern('getSelfFavorites')
  async getSelfFavorites(@Payload() data: GetFavoritesDto) {
    return await this.appService.getSelfFavorites(data.userId);
  }
}
