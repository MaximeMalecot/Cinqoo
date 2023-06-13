import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async getHello(): Promise<string> {
    const count = await this.orderModel.countDocuments();
    return `Order service : there are currently ${count} orders in the database`;
  }

  async createOrder(data: CreateOrderDto) {
    const { serviceId, applicant, billId } = data;

    const order = new this.orderModel({
      applicant,
      serviceId,
      billId,
      status: 'IN_PROGRESS',
    });

    // TODO ? Send an email to the applicant and the service provider to confirm the order
    
    return await order.save();
  }

  async getOrdersOfUser(userId: string) {
    return await this.orderModel.find({ applicant: userId }).exec();
  }
}
