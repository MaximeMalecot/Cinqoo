import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Order, OrderStatus } from './schemas/order.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

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
    const order = await this.orderModel.findById(new Types.ObjectId(orderId));
    if (!order) {
      throw new RpcException({
        statusCode: 404,
        message: 'Order not found',
      });
    }

    return order;
  }

  async getOrderWithPrestation(orderId: string) {
    try {
      const order = await this.orderModel.findById(new Types.ObjectId(orderId));
      if (!order) {
        throw new RpcException({
          statusCode: 404,
          message: 'Order not found',
        });
      }

      const prestation = await firstValueFrom(
        this.prestationService.send('PRESTATION.GET_ONE', order.serviceId),
      );

      if (!prestation) {
        throw new RpcException({
          statusCode: 404,
          message: 'Prestation not found',
        });
      }

      return { ...order.toObject(), prestation };
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  async getAllOrders() {
    return await this.orderModel.find().limit(10);
  }

  async getAllOrdersWithPrestation() {
    try {
      const orders = await this.orderModel.find().limit(10);
      const ordersWithPrestations = await Promise.all(
        orders.map(async (order) => {
          const prestation = await firstValueFrom(
            this.prestationService.send('PRESTATION.GET_ONE', order.serviceId),
          );
          return { ...order.toObject(), prestation };
        }),
      );
      return ordersWithPrestations;
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  // Requests

  async getPendingRequests(userId: string) {
    try {
      const requests = await this.orderModel.find({
        applicant: userId,
        status: OrderStatus.PENDING,
      });

      const requestsWithPrestations = await Promise.all(
        requests.map(async (request) => {
          const prestation = await firstValueFrom(
            this.prestationService.send(
              'PRESTATION.GET_ONE',
              request.serviceId,
            ),
          );
          return { ...request.toObject(), prestation };
        }),
      );

      return requestsWithPrestations;
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
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

  async terminateRequest(data: UpdateRequestDto) {
    //Check if the order status is IN_PROGRESS
    return 'Not implemented yet';
  }

  async confirmFinalization(data: UpdateRequestDto) {
    //check if the order status is TERMINATED

    return 'Not implemented yet';
  }

  async startRevision(data: UpdateRequestDto) {
    //check if the order status is TERMINATED
    //Check how many revisions are allowed
    //Check how many revisions have been made
    return 'Not implemented yet';
  }
}
