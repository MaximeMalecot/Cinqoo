import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';

class ClientProxyMock {
  public send(pattern: string, data: any): any {
    const observable = new Observable((observer) => {
      observer.next({ data: 'test' });
      observer.complete();
    });
    return observable;
  }

  public emit(pattern: string, data: any): void {}

  public close(): void {}
}

class OrderService extends ClientProxyMock {
  invalidId = '507f1f77bcf86cd799439010';
  public send(pattern: string, data: any): any {
    let observable;
    switch (pattern) {
      case 'ORDER.CREATE':
        observable = new Observable((observer) => {
          observer.next({ _id: '507f1f77bcf86cd799439019' });
          observer.complete();
        });
        return observable;

      case 'ORDER.GET_ORDER':
        if (data !== this.invalidId) {
          throw new RpcException({
            message: 'Order not found',
            status: 404,
          });
        }

        const mockOrder = {
          _id: '507f1f77bcf86cd799439010',
          applicant: '507f1f77bcf86cd799439011',
          serviceId: '507f1f77bcf86cd799439012',
          serviceRevisionNb: 1,
          status: 'pending',
          currentRevisionNb: 1,
          billId: '507f1f77bcf86cd799439013',
          date: new Date(),
        };

        observable = new Observable((observer) => {
          observer.next(mockOrder);
          observer.complete();
        });
        return observable;
      default:
        return super.send(pattern, data);
    }
  }
}

class HybridService extends ClientProxyMock {
  public send(pattern: string, data: any): any {
    switch (pattern) {
      default:
        return super.send(pattern, data);
    }
  }
}

class MailerService extends ClientProxyMock {
  public send(pattern: string, data: any): any {
    switch (pattern) {
      default:
        return super.send(pattern, data);
    }
  }
}

export const MockOrderService = new OrderService();
export const MockHybridService = new HybridService();
export const MockMailerService = new MailerService();
