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
class PaymentServiceMock extends ClientProxyMock {
  public send(pattern: string, data: any): any {
    switch (pattern) {
      default:
        return super.send(pattern, data);
    }
  }
}

class StripeClient extends ClientProxyMock {
  public send(pattern: string, data: any): any {
    switch (pattern) {
      default:
        return super.send(pattern, data);
    }
  }
}
class UserService extends ClientProxyMock {
  public send(pattern: string, data: any): any {
    switch (pattern) {
      default:
        return super.send(pattern, data);
    }
  }
}

export const MockPaymentService = new PaymentServiceMock();
export const MockStripeClient = new StripeClient();
export const MockUserService = new UserService();
