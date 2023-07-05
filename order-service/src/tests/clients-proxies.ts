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

class PresationService extends ClientProxyMock {
  invalidServiceId = 'invalidServiceId';
  public send(pattern: string, data: any): any {
    let observable;
    switch (pattern) {
      case 'PRESTATION.CREATE':
        observable = new Observable((observer) => {
          observer.next({ _id: '507f1f77bcf86cd799439019' });
          observer.complete();
        });
        return observable;

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

        observable = new Observable((observer) => {
          observer.next(mockPrestation);
          observer.complete();
        });
        return observable;
      default:
        return super.send(pattern, data);
    }
  }
}

class PaymentService extends ClientProxyMock {
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

export const MockPrestationService = new PresationService();
export const MockPaymentService = new PaymentService();
export const MockMailerService = new MailerService();
