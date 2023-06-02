import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prestation } from './schema/prestation.schema';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Prestation.name) private prestationModel: Model<Prestation>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getHello(): Promise<string> {
    const prestationCount = await this.prestationModel.countDocuments();
    const categoryCount = await this.categoryModel.countDocuments();
    return `Prestation service : there are currently ${prestationCount} prestations in the database and ${categoryCount} categories in the database`;
  }
}
