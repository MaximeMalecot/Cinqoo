import { Controller, Get, Req } from '@nestjs/common';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Controller()
export class AppController {
  @Get()
  async getHello(@Req() req): Promise<string> {
    req.sendRatflow({ event: 'getHello', tag: 'getHello' });
    await sleep(10000);
    return 'Hello World!';
  }
}
