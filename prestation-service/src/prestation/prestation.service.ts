import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
