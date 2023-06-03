import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Deliverable } from './schemas/deliverable.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Deliverable.name)
    private readonly deliverableModel: Model<Deliverable>,
  ) {}

  async getHello(): Promise<string> {
    const count = await this.deliverableModel.countDocuments();
    return `Deliverable service : there are currently ${count} deliverables in the database`;
  }
}
