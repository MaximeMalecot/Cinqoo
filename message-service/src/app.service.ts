import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { BroadcastOrderDto } from './dto/broadcast.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './schemas/message.schema';

@Injectable()
export class AppService {
  constructor(
    @Inject('ORDER_SERVICE') private orderService: ClientProxy,
    @Inject('HYBRID_SERVICE') private hybridService: ClientProxy,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getMessagesByOrder(orderId: string) {
    const order = await firstValueFrom(
      this.orderService.send('ORDER.GET_ORDER', orderId),
    );
    if (!order) {
      throw new RpcException({
        message: 'Order not found',
        statusCode: 404,
      });
    }
    return await this.messageModel.find({ orderId });
  }

  async sendMessage(data: SendMessageDto) {
    const { orderId } = data;
    const order = await firstValueFrom(
      this.orderService.send('ORDER.GET_ORDER', orderId),
    );
    if (!order) {
      throw new RpcException({
        message: 'Order not found',
        statusCode: 404,
      });
    }
    const message = await new this.messageModel(data).save();
    await firstValueFrom(
      this.hybridService.send('HYBRID.BROADCAST_ORDER', {
        message: { type: 'new_message', data: message },
        orderId,
      } as BroadcastOrderDto),
    );
    // REALTIME HERE
    return message;
  }
}
