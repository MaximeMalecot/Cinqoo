import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Deliverable } from './schemas/deliverable.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel('Deliverable') private deliverableModel: Model<Deliverable>) {}

  getHello(): string {
    return 'Hello World!';
  }
}
