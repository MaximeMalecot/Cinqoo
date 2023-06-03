import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite } from './schemas/favorite.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly deliverableModel: Model<Favorite>,
  ) {}

  @EventPattern('getHello')
  async getHello(): Promise<string> {
    const count = await this.deliverableModel.countDocuments();
    return `Favorite service : there are currently ${count} favorites in the database`;
  }
}
