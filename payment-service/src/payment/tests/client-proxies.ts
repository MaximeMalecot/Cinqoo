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

class StripeService extends ClientProxyMock {
  public send(pattern: string, data: any): any {
    let observable;

    switch (pattern) {
      case 'STRIPE.CREATE_PRICE':
        observable = new Observable((observer) => {
          observer.next({ id: 'mockPriceId' });
          observer.complete();
        });
      case 'STRIPE.CREATE_CHECKOUT_SESSION':
        observable = new Observable((observer) => {
          observer.next({ url: 'mockUrl', id: 'mockSessionId' });
          observer.complete();
        });
        return observable;
      case 'STRIPE.REFUND_PAYMENT_INTENT':
        observable = new Observable((observer) => {
          observer.next({ id: 'mockRefundId' });
          observer.complete();
        });
        return observable;
      default:
        return super.send(pattern, data);
    }
  }
}

class OrderService extends ClientProxyMock {
  public send(pattern: string, data: any): any {
    switch (pattern) {
      case 'ORDER.CREATE':
        const observable = new Observable((observer) => {
          observer.next({ _id: '507f1f77bcf86cd799439011' });
          observer.complete();
        });
        return observable;
      default:
        return super.send(pattern, data);
    }
  }
}

class PrestationService extends ClientProxyMock {
  invalidServiceId = 'invalidServiceId';

  public send(pattern: string, data: any): any {
    switch (pattern) {
      case 'PRESTATION.GET_ONE':
        if (data == this.invalidServiceId) {
          throw new RpcException({
            message: 'Prestation not found',
            status: 404,
          });
        }

        const mockPrestation = {
          _id: '507f1f77bcf86cd799439011',
          name: 'mockPrestation',
          price: 100,
          stripeId: 'mockStripeId',
        };

        const observable = new Observable((observer) => {
          observer.next(mockPrestation);
          observer.complete();
        });
        return observable;
      default:
        return super.send(pattern, data);
    }
  }
}

export const MockPrestationService = new PrestationService();
export const MockOrderService = new OrderService();
export const MockStripeService = new StripeService();
