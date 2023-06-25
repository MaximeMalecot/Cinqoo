import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SseService } from './sse.service';

@ApiTags('sse')
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Post()
  async test() {
    const res = await this.sseService.broadcastAll({
      message: {
        type: 'new_message',
        data: {
          test: 'oui',
        },
      },
    });
    return res;
  }

  @Post('order')
  async order() {
    const res = await this.sseService.broadcastOrder({
      message: {
        type: 'new_message',
        data: {
          test: 'oui',
        },
      },
      orderId: 'hihi',
    });
    return res;
  }

  @Post('user')
  async user() {
    const res = await this.sseService.broadcastUser({
      message: {
        type: 'new_message',
        data: {
          test: 'oui',
        },
      },
      userId: '64944b3c6610724aea88568e',
    });
    return res;
  }
}
