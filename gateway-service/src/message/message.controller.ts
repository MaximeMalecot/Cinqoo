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
import { SendMessageDto } from './dto/send-message.dto';
import { IsUserPartOfOrderGuard } from './guards/is-user-part-of-order.guard';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(
    @Inject('MESSAGE_SERVICE') private readonly messageService: ClientProxy,
  ) {}

  @UseGuards(IsUserPartOfOrderGuard)
  @Get(':orderId')
  async getMessagesByOrder(@Param('orderId') orderId: string) {
    return await this.messageService.send(
      'MESSAGE.GET_MESSAGES_BY_ORDER',
      orderId,
    );
  }

  @UseGuards(IsUserPartOfOrderGuard)
  @Post()
  async sendMessage(@Req() req, @Body() data: SendMessageDto) {
    return await this.messageService.send('MESSAGE.SEND_MESSAGE', {
      ...data,
      senderId: req.user._id,
    });
  }
}
