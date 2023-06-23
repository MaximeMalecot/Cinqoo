import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { DoneRequestDto } from './dto/done-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Order, OrderStatus } from './schemas/order.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
    @Inject('PAYMENT_SERVICE')
    private readonly paymentService: ClientProxy,
  ) {}

  async getHello(): Promise<string> {
    const count = await this.orderModel.countDocuments();
    return `Order service : there are currently ${count} orders in the database`;
  }

  async createOrder(data: CreateOrderDto) {
    const { serviceId, applicant, billId } = data;

    const service = await firstValueFrom(
      this.prestationService.send('PRESTATION.GET_ONE', serviceId),
    );

    const order = new this.orderModel({
      applicant,
      serviceId,
      billId,
      serviceRevisionNb: service.revisionNb,
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

  async getUsers(orderId: string) {
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
      const users = [prestation.owner, order.applicant];
      return users;
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
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
      const prestations = await firstValueFrom(
        this.prestationService.send(
          'PRESTATION.GET_ACTIVE_PRESTATIONS_OF_USER',
          userId,
        ),
      );

      const requests = [];

      for (const prestation of prestations) {
        const request = await this.orderModel.findOne({
          serviceId: prestation._id,
          status: OrderStatus.PENDING,
        });
        if (request) {
          requests.push({ ...request.toObject(), prestation });
        }
      }

      return requests;
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
      throw new RpcException({
        statusCode: 400,
        message: 'Order not found',
      });
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
    try {
      const { userId, orderId } = data;
      const order = await this.orderModel.findById(new Types.ObjectId(orderId));
      if (!order) {
        throw new RpcException({
          statusCode: 404,
          message: 'Order not found',
        });
      }
      if (order.status !== 'PENDING') {
        throw new RpcException({
          statusCode: 400,
          message: 'Order is not pending',
        });
      }
      order.status = OrderStatus.REFUSED;
      await order.save();
      await firstValueFrom(
        this.paymentService.send('PAYMENT.REFUND_BILL', order.billId),
      );
      return { message: 'Order refused' };
    } catch (e: any) {
      console.log(e.message);
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  async terminateRequest(data: UpdateRequestDto) {
    //Check if the order status is IN_PROGRESS
    const order = await this.orderModel.findById(
      new Types.ObjectId(data.orderId),
    );
    if (!order) {
      throw new RpcException({
        statusCode: 404,
        message: 'Order not found',
      });
    }
    if (order.status !== OrderStatus.IN_PROGRESS) {
      throw new RpcException({
        statusCode: 400,
        message: 'Order is not in progress',
      });
    }
    order.status = OrderStatus.TERMINATED;
    await order.save();
    return { message: 'Order terminated' };
  }

  async confirmFinalization(data: UpdateRequestDto) {
    //check if the order status is TERMINATED
    const order = await this.orderModel.findById(
      new Types.ObjectId(data.orderId),
    );
    if (!order) {
      throw new RpcException({
        statusCode: 404,
        message: 'Order not found',
      });
    }
    if (order.status !== OrderStatus.TERMINATED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Order is not terminated',
      });
    }
    order.status = OrderStatus.DONE;
    await order.save();

    //Pay the provider
    await firstValueFrom(
      this.paymentService.send('PAYMENT.PAY_PRESTATION_PROVIDER', order.billId),
    );

    return { message: 'Order marked as done' };
  }

  async startRevision(data: UpdateRequestDto) {
    //check if the order status is TERMINATED
    //Check how many revisions are allowed
    //Check how many revisions have been made
    try {
      const order = await this.orderModel.findById(
        new Types.ObjectId(data.orderId),
      );
      if (!order) {
        throw new RpcException({
          statusCode: 404,
          message: 'Order not found',
        });
      }
      if (order.status !== OrderStatus.TERMINATED) {
        throw new RpcException({
          statusCode: 400,
          message: 'Order is not terminated',
        });
      }
      if (order.serviceRevisionNb == order.currentRevisionNb) {
        throw new RpcException({
          statusCode: 400,
          message: 'Revision limit reached',
        });
      }
      order.currentRevisionNb = order.currentRevisionNb + 1;
      order.status = OrderStatus.IN_PROGRESS;
      await order.save();
      return { message: 'Revision started' };
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

  async hasDone(data: DoneRequestDto) {
    const order = await this.orderModel.findOne({
      ...data,
      status: OrderStatus.DONE,
    });
    if (!order) {
      return false;
    }
    return true;
  }
}
