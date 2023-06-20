import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getHello(): Promise<string> {
    const categoryCount = await this.categoryModel.countDocuments();
    return `Prestation service : there are currently ${categoryCount} categories in the database`;
  }
}
