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

export const MockStripeService = new StripeService();
