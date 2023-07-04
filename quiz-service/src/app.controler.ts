import { Controller, Get } from '@nestjs/common';

@Controller('sockets')
export class AppController {
  constructor() {}

  @Get()
  public getHello(): string {
    return 'Hello World!';
  }
}
