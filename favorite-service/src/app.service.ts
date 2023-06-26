import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return await this.favoriteModel.find({ userId: userId }).exec();
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
