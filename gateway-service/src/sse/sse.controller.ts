import { Controller, Param, Post } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { SseService } from './sse.service';

@ApiTags('sse')
@ApiExcludeController()
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Post()
  @Roles(ROLE.ADMIN)
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
  @Roles(ROLE.ADMIN)
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
  @Roles(ROLE.ADMIN)
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
