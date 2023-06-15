import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Order, OrderStatus } from './schemas/order.schema';

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
      status: 'PENDING',
    });

    // TODO ? Send an email to the applicant and the service provider to confirm the order

    return await order.save();
  }

  async getOrdersOfUser(userId: string) {
    return await this.orderModel.find({ applicant: userId }).exec();
  }

  async getOrder(orderId: string) {
    return await this.orderModel.findById(new Types.ObjectId(orderId)).exec();
  }

  async getAllOrders() {
    return await this.orderModel.find().limit(10);
  }

  // Requests

  async getPendingRequests(userId: string) {
    return await this.orderModel
      .find({ applicant: userId, status: 'PENDING' })
      .exec();
  }

  async acceptRequest(data: UpdateRequestDto) {
    const { userId, orderId } = data;
    const order = await this.orderModel.findById(new Types.ObjectId(orderId));
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status !== 'PENDING') {
      throw new RpcException({
        statusCode: 400,
        message: 'Order is not pending',
      });
    }
    order.status = OrderStatus.IN_PROGRESS;
    await order.save();
    return { message: 'Order accepted' };
  }

  async refuseRequest(data: UpdateRequestDto) {
    const { userId, orderId } = data;
    const order = await this.orderModel.findById(new Types.ObjectId(orderId));
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status !== 'PENDING') {
      throw new RpcException({
        statusCode: 400,
        message: 'Order is not pending',
      });
    }
    order.status = OrderStatus.REFUSED;
    await order.save();
    return { message: 'Order refused' };
  }
}
