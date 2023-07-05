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
  public send(pattern: string, data: any): any {
    switch (pattern) {
      default:
        return super.send(pattern, data);
    }
  }
}

export const MockOrderService = new OrderService();
