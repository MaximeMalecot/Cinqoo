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
    const billCount = await this.billModel.countDocuments();
    return `Payment service : there are currently ${billCount} bills in the database`;
  }
}
