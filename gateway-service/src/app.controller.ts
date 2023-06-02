import { Controller, Get, Req } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getHello(@Req() req): Promise<string> {
    return 'Hello World!';
  }
}
