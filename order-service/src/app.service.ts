import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  getHello(): string {
    return 'Hello World from order!';
  }
}
