import { Controller, Get, Req } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  async getHello(@Req() req): Promise<string> {
    return 'Hello World!';
  }
}
