import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  async getHello(): Promise<string> {
    const count = 0;
    return `Prestation service, there are currently ${count} prestations in the database`;
  }
}
