import { Controller, Get, Req, Res } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { AppService } from './app.service';
import {
  BroadcastDto,
  BroadcastOrderDto,
  BroadcastUserDto,
} from './dto/broadcast.dto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  async getSse(@Req() req, @Res() res: Response, next) {
    try {
      const userId = req.user._id;
      this.appService.addUser(userId, res, req.user.roles);

      res.on('close', () => {
        console.log('close', userId);
        this.appService.deleteUser(userId, req.user.roles);
      });

      const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      };
      res.writeHead(200, headers);
      res.write(`data: ${JSON.stringify({ type: 'connect', userId })}\n\n`);
      setInterval(() => {
        this.appService.broadcastSpecific({ type: 'connect', userId }, userId);
      }, 5000);
    } catch (err) {
      console.error(err);
      next();
    }
  }

  @EventPattern('HYBRID.BROADCAST_ALL')
  async broadcastAll(@Payload() data: BroadcastDto) {
    await this.appService.broadcastAll(data.message);
    console.log('ALL', data);
    return {
      event: 'message_printed',
      success: true,
    };
  }

  @EventPattern('HYBRID.BROADCAST_ORDER')
  async broadcastOrder(@Payload() data: BroadcastOrderDto) {
    console.log('ORDER', data);
    return {
      event: 'message_printed',
      success: true,
    };
  }

  @EventPattern('HYBRID.BROADCAST_USER')
  async broadcastUser(@Payload() data: BroadcastUserDto) {
    await this.appService.broadcastSpecific(data.message, data.userId);
    console.log('USER', data);
    return {
      event: 'message_printed',
      success: true,
    };
  }
}
