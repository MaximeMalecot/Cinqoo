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

class UserService extends ClientProxyMock {
  invalidServiceId = 'invalidServiceId';

  public send(pattern: string, data: any): any {
    switch (pattern) {
      case 'USER.CREATE':
        const mockUser = {
          username: 'test',
          email: 'test@testnon.fr',
          password: 'test',
        };

        const observable = new Observable((observer) => {
          observer.next(mockUser);
          observer.complete();
        });
        return observable;
      default:
        return super.send(pattern, data);
    }
  }
}
export const MockUserService = new UserService();
