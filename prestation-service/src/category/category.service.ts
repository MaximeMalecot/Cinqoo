import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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

  async getAll() {
    const categories = await this.categoryModel.find();
    return categories;
  }

  async getAllPrestations(id: number) {
    const prestations = await this.categoryModel
      .findById(new Types.ObjectId(id))
      .populate('prestations', {
        __v: false,
      });

    return prestations;
  }

  async getOne(id: number) {
    const category = await this.categoryModel.findById(new Types.ObjectId(id));
    return category;
  }

  async createOne(data: CreateCategoryDto) {
    try {
      const newPrestation = new this.categoryModel(data);
      return await newPrestation.save();
    } catch (e: any) {
      if (e.code === 11000) {
        throw new RpcException('Category name already exists');
      }
      throw new RpcException(e.message);
    }
  }

  async updateOne(data: UpdateCategoryDto) {
    try {
      const { id, ...rest } = data;
      const updatedPrestation = await this.categoryModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        rest,
        { new: true },
      );
      return updatedPrestation;
    } catch (e: any) {
      if (e.code === 11000) {
        throw new RpcException('Category name already exists');
      }
      throw new RpcException(e.message);
    }
  }
}
