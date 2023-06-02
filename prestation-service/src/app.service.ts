import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prestation } from './schema/prestation.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Prestation.name) private prestationModel: Model<Prestation>,
  ) {}

  async getHello(): Promise<string> {
    const count = this.prestationModel.countDocuments();
    return `Prestation service, there are currently ${count} prestations in the database`;
  }
}
