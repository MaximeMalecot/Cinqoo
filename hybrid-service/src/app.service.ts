import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ROLE } from './enums/role.enum';

interface IUserConnections {
  [userId: string]: {
    [sseId: string]: Response;
  };
}

interface IOrderConnections {
  [orderId: string]: Set<string>;
}

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);
  private users: IUserConnections = {};
  private orders: IOrderConnections = {};

  constructor(
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  convertMessage({ type, ...data }) {
    return `event: ${type}\n` + `data: ${JSON.stringify(data)}\n\n`;
  }

  broadcastSpecific(message, userId) {
    if (this.users[userId]) {
      this.logger.log(
        'sending message to client: ' + userId + ', type: ' + message?.type,
      );
      if (Object.values(this.users[userId]).length > 0) {
        Object.values(this.users[userId]).forEach((res) => {
          res.write(this.convertMessage(message));
        });
      }
    }
  }

  broadcastOrder(message, orderId) {
    if (
      this.orders[orderId] &&
      this.orders[orderId].size &&
      this.orders[orderId].size > 0
    ) {
      this.orders[orderId].forEach((userId) => {
        this.broadcastSpecific(message, userId);
      });
    }
  }

  broadcastAll(message) {
    Object.keys(this.users).forEach((userId) => {
      this.broadcastSpecific(message, userId);
    });
  }

  async addUser(
    userId: string,
    sseId: string,
    res: Response,
    roles: Array<ROLE> = [ROLE.USER],
  ) {
    console.log('add user', userId);
    if (!this.users[userId]) this.users[userId] = {};
    this.users[userId][sseId] = res;
    let orders = await this.getOrders(userId, roles);
    if (orders.length > 0) {
      orders.map((order) => {
        if (!this.orders[order._id]) this.orders[order._id] = new Set();
        this.orders[order._id].add(userId);
      });
    }
  }

  async deleteUser(
    userId: string,
    sseId: string,
    roles: Array<ROLE> = [ROLE.USER],
  ) {
    console.log('deleting user', userId);
    delete this.users[userId][sseId];
    let orders = await this.getOrders(userId, roles);
    if (
      orders.length > 0 &&
      (!this.users[userId] || Object.values(this.users[userId]).length === 0)
    ) {
      orders.map((order) => {
        this.orders[order._id].delete(userId);
      });
    }
  }

  async getOrders(userId: string, roles: Array<ROLE> = [ROLE.USER]) {
    let orders = [];
    if (roles.includes(ROLE.FREELANCER)) {
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
  }
}
