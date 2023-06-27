import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from 'src/category/category.service';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { SearchPrestationsDto } from './dto/search-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { Prestation } from './schemas/prestation.schema';

@Injectable()
export class PrestationService {
  constructor(
    @InjectModel(Prestation.name) private prestationModel: Model<Prestation>,
    @Inject('STRIPE_SERVICE') private stripeService: ClientProxy,
    private categoryService: CategoryService,
  ) {}

  async getAll() {
    const prestations = await this.prestationModel
      .find({ isActive: true })
      .populate('categories')
      .select({
        __v: false,
        stripeId: false,
      })
      .limit(10);
    return prestations;
  }

  async getAllAdmin() {
    const prestations = await this.prestationModel
      .find()
      .populate('categories')
      .limit(10);
    return prestations;
  }

  async searchPrestations(data: SearchPrestationsDto) {
    const { query, price_min, price_max, categories } = data;

    const filters = {
      isActive: true,
    };

    if (query) {
      filters['name'] = { $regex: '.*' + query + '.*', $options: 'i' };
    }

    if (price_min) {
      filters['price'] = {
        $gte: price_min,
      };
    }

    if (price_max) {
      filters['price'] = {
        ...filters['price'],
        $lte: price_max,
      };
    }

    if (categories) {
      filters['categories'] = {
        $all: categories.map((c) => new Types.ObjectId(c)),
      };
    }

    return await this.prestationModel.find(filters).populate('categories');
  }

  async create(prestation: CreatePrestationDto, userId: string, file: string) {
    const product = await firstValueFrom(
      this.stripeService.send('STRIPE.CREATE_PRODUCT', {
        name: prestation.name,
      }),
    );

    const localCategories = [];
    if (
      prestation.categories &&
      Array.isArray(prestation.categories) &&
      prestation.categories.length > 0
    ) {
      const rawCategories = Array.from(new Set(prestation.categories));
      await Promise.all(
        rawCategories.map(async (category: string) => {
          const exists = await this.categoryService.getOne(category);
          if (exists) {
            localCategories.push(exists._id);
          }
        }),
      );
    }

    const newPrestation = {
      ...prestation,
      categories: localCategories,
      stripeId: product.id,
      owner: new Types.ObjectId(userId),
      image: file,
    };
    const createdPrestation = new this.prestationModel(newPrestation);
    const savedPrestation = await createdPrestation.save();

    const {
      image,
      name,
      revisionNb,
      description,
      price,
      delay,
      _id,
      categories,
    } = savedPrestation;
    return {
      image,
      name,
      revisionNb,
      description,
      price,
      delay,
      _id,
      categories,
    };
  }

  async getPrestationsOfUser(userId: string, active: boolean) {
    const filter = {
      owner: new Types.ObjectId(userId),
    };

    if (active !== null && active !== undefined) {
      filter['isActive'] = active;
    }

    const prestations = await this.prestationModel
      .find(filter)
      .select({
        __v: false,
        owner: false,
        stripeId: false,
      })
      .populate('categories');

    return prestations;
  }

  async getActivePrestationsOfUser(userId: string) {
    const prestations = await this.prestationModel
      .find({
        owner: new Types.ObjectId(userId),
        isActive: true,
      })
      .populate('categories')
      .select({
        __v: false,
        owner: false,
        stripeId: false,
      });

    if (!prestations) {
      throw new RpcException({
        statusCode: 404,
        message: 'Not Found',
      });
    }

    return prestations;
  }

  async getPrestation(prestationId: string) {
    try {
      const prestation = await this.prestationModel
        .findById(new Types.ObjectId(prestationId))
        .populate('categories');

      if (!prestation) {
        throw new RpcException({
          statusCode: 404,
          message: 'Prestation not Found',
        });
      }

      return prestation.toObject();
    } catch (e: any) {
      throw new RpcException({
        statusCode: 404,
        message: e.message,
      });
    }
  }

  async updatePrestation(
    prestationId: string,
    prestation: UpdatePrestationDto,
    file: string,
  ) {
    const localCategories = [];
    if (
      prestation.categories &&
      Array.isArray(prestation.categories) &&
      prestation.categories.length > 0
    ) {
      const rawCategories = Array.from(new Set(prestation.categories));
      await Promise.all(
        rawCategories.map(async (category: string) => {
          const exists = await this.categoryService.getOne(category);
          if (exists) {
            localCategories.push(exists._id);
          }
        }),
      );
    }

    const updatedPrestation = await this.prestationModel.findByIdAndUpdate(
      new Types.ObjectId(prestationId),
      {
        name: prestation.name,
        description: prestation.description,
        price: prestation.price,
        delay: prestation.delay,
        image: file,
        categories: localCategories,
      },
      { new: true },
    );

    return updatedPrestation;
  }

  async disablePrestation(prestationId: string) {
    const prestation = await this.prestationModel.findById(
      new Types.ObjectId(prestationId),
    );

    if (!prestation) {
      throw new RpcException({
        statusCode: 404,
        message: 'Not Found',
      });
    }

    const disabledPrestation = await this.prestationModel.findByIdAndUpdate(
      new Types.ObjectId(prestationId),
      { isActive: false },
      { new: true },
    );
    return disabledPrestation;
  }

  async softDeletePrestationsOfUser(userId: string) {
    await this.prestationModel.updateMany(
      {
        owner: new Types.ObjectId(userId),
      },
      {
        name: 'DELETED',
        description: 'DELETE',
        isActive: false,
        image: '',
      },
    );
    return;
  }

  async enablePrestation(prestationId: string) {
    const prestation = await this.prestationModel.findById(
      new Types.ObjectId(prestationId),
    );

    if (!prestation) {
      throw new RpcException({
        statusCode: 404,
        message: 'Not Found',
      });
    }

    const enabledPrestation = await this.prestationModel.findByIdAndUpdate(
      new Types.ObjectId(prestationId),
      { isActive: true },
      { new: true },
    );
    return enabledPrestation;
  }

  async deletePrestation(prestationId: string) {
    const prestation = await this.prestationModel.findById(
      new Types.ObjectId(prestationId),
    );

    if (!prestation) {
      throw new RpcException({
        statusCode: 404,
        message: 'Not Found',
      });
    }

    await this.prestationModel.findByIdAndDelete(
      new Types.ObjectId(prestationId),
    );
    return { deleted: true };
  }
}
