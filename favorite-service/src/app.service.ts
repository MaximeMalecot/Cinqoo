import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, EventPattern, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import {
  FavoriteRequestDto,
  FavoriteResultDto,
} from './dto/favorite-express.dto';
import { Favorite } from './schemas/favorite.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<Favorite>,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

  @EventPattern('getHello')
  async getHello(): Promise<string> {
    const count = await this.favoriteModel.countDocuments();
    return `Favorite service : there are currently ${count} favorites in the database`;
  }

  async addOrDeleteFavorite(
    dto: FavoriteRequestDto,
  ): Promise<FavoriteResultDto> {
    let favorite = await this.favoriteModel.findOne({
      prestationId: dto.prestationId,
      userId: dto.userId,
    });
    if (favorite) {
      await this.favoriteModel.deleteOne({
        prestationId: dto.prestationId,
        userId: dto.userId,
      });
      return {
        status: true,
        message: 'DELETED',
      };
    }
    favorite = new this.favoriteModel({
      prestationId: dto.prestationId,
      userId: dto.userId,
    });
    await favorite.save();
    return {
      status: true,
      message: 'ADDED',
    };
  }

  async getSelfFavorites(userId: string) {
    try {
      const favorites = await this.favoriteModel.find({ userId: userId });
      const favoritesWithPrestation = await Promise.all(
        favorites.map(async (favorite) => {
          const prestation = await firstValueFrom(
            this.prestationService.send(
              'PRESTATION.GET_ONE',
              favorite.prestationId,
            ),
          ).catch(() => null);

          if (!prestation) {
            return;
          }

          if (prestation.isActive === false) {
            return;
          }
          return {
            ...favorite.toObject(),
            prestation,
          };
        }),
      );
      return favoritesWithPrestation.filter((favorite) => favorite);
    } catch (e: any) {
      console.log(e.message);
      throw new RpcException({ statusCode: 500, message: e.message });
    }
  }

  async getSpecificFavorite(dto: FavoriteRequestDto) {
    const favorite = await this.favoriteModel.findOne({
      prestationId: dto.prestationId,
      userId: dto.userId,
    });
    if (favorite) {
      return {
        isFavorite: true,
      };
    }
    return {
      isFavorite: false,
    };
  }
}
