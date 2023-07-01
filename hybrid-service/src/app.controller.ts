import { Controller, Get, HttpCode, Logger, Req, Res } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import {
  BroadcastDto,
  BroadcastOrderDto,
  BroadcastUserDto,
} from './dto/broadcast.dto';

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);
  constructor(private appService: AppService) {}

  @Get('')
  @HttpCode(200)
  @Public()
  hello() {
    return 'Welcome to Cinqoo REALTIME-SERVICE';
  }

  @Get('conversations')
  @HttpCode(200)
  @Public()
  helloConversation() {
    return 'Welcome to Cinqoo REALTIME-SERVICE';
  }

  @Get('conversations/health')
  @HttpCode(200)
  @Public()
  healthCheck() {
    return {
      status: 'UP',
    };
  }

  @Get('conversations/sse')
  async getSse(@Req() req, @Res() res: Response, next) {
    try {
      const userId = req.user._id;
      this.appService.addUser(userId, res, req.user.roles);

      req.on('error', (err) => {
        this.logger.error('error on req of client: ' + userId + err, err);
      });

      req.on('close', (err) => {
        this.logger.log('closing req of client: ' + userId);
        res.write(this.appService.convertMessage({ type: 'end', err }));
        this.appService.deleteUser(userId, req.user.roles);
      });

      const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      };
      res.writeHead(200, headers);
      res.write(this.appService.convertMessage({ type: 'connect', userId }));
      res.setTimeout(0);
    } catch (err) {
      console.error(err);
      next();
    }
  }

  @EventPattern('HYBRID.BROADCAST_ALL')
  async broadcastAll(@Payload() data: BroadcastDto) {
    await this.appService.broadcastAll(data.message);
    return {
      event: 'message_printed',
      success: true,
    };
  }

  @EventPattern('HYBRID.BROADCAST_ORDER')
  async broadcastOrder(@Payload() data: BroadcastOrderDto) {
    await this.appService.broadcastOrder(data.message, data.orderId);
    return {
      event: 'message_printed',
      success: true,
    };
  }

  @EventPattern('HYBRID.BROADCAST_USER')
  async broadcastUser(@Payload() data: BroadcastUserDto) {
    await this.appService.broadcastSpecific(data.message, data.userId);
    return {
      event: 'message_printed',
      success: true,
    };
  }
}
