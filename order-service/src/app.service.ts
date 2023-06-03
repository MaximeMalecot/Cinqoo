import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async getHello(): Promise<string> {
    const count = await this.orderModel.countDocuments();
    return `Order service : there are currently ${count} orders in the database`;
  }
}
