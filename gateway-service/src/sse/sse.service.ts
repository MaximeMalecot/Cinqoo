import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SseService {
  private users = [];
  private orders = {};
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  convertMessage = ({ type, ...data }) => {
    console.log(`event: ${type}\n` + `data: ${JSON.stringify(data)}\n\n`);
    return `event: ${type}\n` + `data: ${JSON.stringify(data)}\n\n`;
  };

  broadcastSpecific = (message, userId) => {
    if (this.users[userId]) {
      this.users[userId].write(this.convertMessage(message));
    }
  };

  broadcastOrder = (message, orderId) => {
    if (this.orders[orderId] && this.orders[orderId].length > 0) {
      this.orders[orderId].map((userId) => {
        this.broadcastSpecific(message, userId);
      });
    }
  };

  addUser = async (userId, res, roles = ['USER']) => {
    this.users[userId] = res;
    let orders = await this.getOrders(userId, roles);
    if (orders.length > 0) {
      orders.map((order) => {
        if (!this.orders[order._id]) this.orders[order._id] = new Set();
        this.orders[order._id].add(userId);
      });
    }
  };

  deleteUser = async (userId, roles = ['USER']) => {
    delete this.users[userId];
    let orders = await this.getOrders(userId, roles);
    if (orders.length > 0) {
      orders.map((order) => {
        this.orders[order._id].delete(userId);
      });
    }
  };

  getOrders = async (userId, roles = ['USER']) => {
    let orders = [];
    if (roles.includes('FREELANCER')) {
      orders = await firstValueFrom(
        this.orderService.send('ORDER.GET_ALL_REQUESTS', userId),
      );
    }
    orders = [
      ...orders,
      ...(await firstValueFrom(
        this.orderService.send('ORDER.GET_ORDERS_OF_USER', userId),
      )),
    ];
    return orders;
  };

  logOrders = () => {
    console.log('orders', this.orders);
  };
}