import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { Prestation } from './schemas/prestation.schema';

@Injectable()
export class PrestationService {
  constructor(
    @InjectModel(Prestation.name) private prestationModel: Model<Prestation>,
    @Inject('STRIPE_SERVICE') private stripeService: ClientProxy,
  ) {}

  async getAll() {
    const prestations = await this.prestationModel
      .find({ isActive: true })
      .select({
        __v: false,
        stripeId: false,
      })
      .limit(10);
    return prestations;
  }

  async getAllAdmin() {
    const prestations = await this.prestationModel.find().limit(10);
    return prestations;
  }

  async create(prestation: CreatePrestationDto, userId: string, file: string) {
    const product = await firstValueFrom(
      this.stripeService.send('STRIPE.CREATE_PRODUCT', {
        name: prestation.name,
      }),
    );

    const newPrestation = {
      ...prestation,
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
      _id: id,
    } = savedPrestation;
    return {
      image,
      name,
      revisionNb,
      description,
      price,
      delay,
      id,
    };
  }

  async getPrestationsOfUser(userId: string, active: boolean) {
    const filter = {
      owner: new Types.ObjectId(userId),
    };

    if (active !== null && active !== undefined) {
      filter['isActive'] = active;
    }

    const prestations = await this.prestationModel.find(filter).select({
      __v: false,
      owner: false,
      stripeId: false,
    });

    return prestations;
  }

  async getActivePrestationsOfUser(userId: string) {
    const prestations = await this.prestationModel
      .find({
        owner: new Types.ObjectId(userId),
        isActive: true,
      })
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
    const prestation = await this.prestationModel.findById(
      new Types.ObjectId(prestationId),
    );

    if (!prestation) {
      throw new RpcException({
        statusCode: 404,
        message: 'Prestation not Found',
      });
    }

    return prestation.toObject();
  }

  async updatePrestation(
    prestationId: string,
    prestation: UpdatePrestationDto,
  ) {
    const updatedPrestation = await this.prestationModel.findByIdAndUpdate(
      new Types.ObjectId(prestationId),
      prestation,
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
