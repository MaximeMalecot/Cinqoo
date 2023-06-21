import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublishDto } from './dto/publish.dto';
import { Deliverable } from './schemas/deliverable.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Deliverable.name)
    private readonly deliverableModel: Model<Deliverable>,
  ) {}

  async getAllDeliverablesForAnOrder(orderId: string) {
    const deliverables = await this.deliverableModel.find({ orderId: orderId });
    return deliverables;
  }

  async publishDeliverable(orderId: string, data: PublishDto) {
    try {
      const deliverable = new this.deliverableModel({
        orderId: orderId,
        link: data.link,
        name: data.name,
      });

      await deliverable.save();
      return deliverable;
    } catch (err: any) {
      throw new RpcException({
        statusCode: 404,
        message: err.message,
      });
    }
  }
}
