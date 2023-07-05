import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  public healthCheck(): string {
    return 'OK';
  }

  @Get('sockets')
  public socketsCheck(): string {
    return 'OK';
  }

  @Get()
  public getHello(): string {
    return 'Hello World!';
  }
}
