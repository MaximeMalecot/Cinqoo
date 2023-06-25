import { Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
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
        data: 'BROADCASTINGALL',
      },
    });
    return res;
  }

  @Post('order/:orderId')
  async order(@Param('orderId', CheckObjectIdPipe) orderId: string) {
    const res = await this.sseService.broadcastOrder({
      message: {
        type: 'new_message',
        data: 'BROADCASTINGORDER',
      },
      orderId,
    });
    return res;
  }

  @Post('user/:userId')
  async user(@Param('userId', CheckObjectIdPipe) userId: string) {
    const res = await this.sseService.broadcastUser({
      message: {
        type: 'new_message',
        data: 'BROADCASTINGUSER',
      },
      userId,
    });
    return res;
  }
}
