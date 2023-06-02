import { Injectable } from '@nestjs/common';
import { Bill } from './schema/bill.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>,
  ) {}

  async getHello(): Promise<string> {
    return `Bill service`;
  }
}
