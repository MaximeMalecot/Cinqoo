import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { SseService } from 'src/sse/sse.service';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessageGuard } from './guards/get-message.guard';
import { SendMessageGuard } from './guards/send-message.guard';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(
    @Inject('MESSAGE_SERVICE') private readonly messageService: ClientProxy,
    private readonly sseService: SseService,
  ) {}

  @UseGuards(GetMessageGuard)
  @Get(':orderId')
  async getMessagesByOrder(@Param('orderId') orderId: string) {
    return await this.messageService.send(
      'MESSAGE.GET_MESSAGES_BY_ORDER',
      orderId,
    );
  }

  @UseGuards(SendMessageGuard)
  @Post()
  async sendMessage(@Req() req, @Body() data: SendMessageDto) {
    const message = await firstValueFrom(
      this.messageService.send('MESSAGE.SEND_MESSAGE', {
        ...data,
        senderId: req.user._id,
      }),
    );
    this.sseService.broadcastOrder(
      { type: 'new_message', message },
      data.orderId,
    );
    return message;
  }
}
