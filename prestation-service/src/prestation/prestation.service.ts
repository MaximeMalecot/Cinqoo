import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { Prestation } from './schemas/prestation.schema';

@Injectable()
export class PrestationService {
  constructor(
    @InjectModel(Prestation.name) private prestationModel: Model<Prestation>,
  ) {}

  async getHello(): Promise<string> {
    const prestationCount = await this.prestationModel.countDocuments();
    return `Prestation service : there are currently ${prestationCount} prestations in the database`;
  }

  async create(prestation: CreatePrestationDto, user: any) {
    const stripeId = `stripe_price_${crypto.randomUUID().toString()}`;
    const newPrestation = {
      ...prestation,
      stripeId,
      owner: new Types.ObjectId(user._id),
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

  getPrestationsOfUser(userId: string) {
    return this.prestationModel
      .find({ owner: new Types.ObjectId(userId) })
      .select({
        __v: false,
        owner: false,
        stripeId: false,
      });
  }

  getActivePrestationsOfUser(userId: string) {
    return this.prestationModel
      .find({
        owner: new Types.ObjectId(userId),
        isActive: true,
      })
      .select({
        __v: false,
        owner: false,
        stripeId: false,
      });
  }

  async getPrestation(prestationId: string) {
    return await this.prestationModel.findById(
      new Types.ObjectId(prestationId),
    );
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
}
