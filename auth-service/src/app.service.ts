import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Auth service';
  }

  decodeToken(token: string): any {
    return `decode ${token}`;
  }
}
