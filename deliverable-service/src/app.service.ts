import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { PublishDto } from './dto/publish.dto';
import { Deliverable } from './schemas/deliverable.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Deliverable.name)
    private readonly deliverableModel: Model<Deliverable>,
    @Inject('ORDER_SERVICE')
    private readonly orderService: ClientProxy,
    @Inject('MAILER_SERVICE')
    private readonly mailerService: ClientProxy,
  ) {}

  async getAllDeliverablesForAnOrder(orderId: string) {
    try {
      const deliverables = await this.deliverableModel.find({
        orderId: orderId,
      });
      return deliverables;
    } catch (e: any) {
      console.log(e);
      throw new RpcException({
        statusCode: 404,
        message: e.message,
      });
    }
  }

  async publishDeliverable(orderId: string, data: PublishDto) {
    try {
      const deliverable = new this.deliverableModel({
        orderId: orderId,
        link: data.link,
        name: data.name,
      });

      await deliverable.save();
      this.sendNewDeliverableEmail(orderId);
      return deliverable;
    } catch (err: any) {
      throw new RpcException({
        statusCode: 404,
        message: err.message,
      });
    }
  }

  // Mails
  private async sendNewDeliverableEmail(orderId: string) {
    const order = await firstValueFrom(
      this.orderService.send('ORDER.GET_ORDER', orderId),
    );
    this.mailerService.emit('MAILER.SEND_REDIRECT_MAIL', {
      targetId: order.applicant,
      redirectUrl: `http://localhost:3000/orders/${orderId}`,
      label: 'Track order',
      subject: 'New deliverable',
      text: `A new deliverable has been published for your order ${orderId}`,
    });
  }
}
