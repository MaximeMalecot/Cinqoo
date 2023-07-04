import { Controller, Get } from '@nestjs/common';

@Controller('socket')
export class SocketController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello from Socket!';
  }
}
