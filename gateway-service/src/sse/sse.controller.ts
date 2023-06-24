import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SseService } from './sse.service';

@ApiTags('sse')
@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}

  @Get()
  async getSse(@Req() req, @Res() res: Response, next) {
    try {
      const userId = req.user._id;
      this.sseService.addUser(userId, res, req.user.roles);

      res.on('close', () => {
        console.log('close', userId);
        this.sseService.deleteUser(userId, req.user.roles);
      });

      const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      };
      res.writeHead(200, headers);
      res.write(`data: ${JSON.stringify({ type: 'connect', userId })}\n\n`);
      setInterval(() => {
        this.sseService.broadcastSpecific({ type: 'connect', userId }, userId);
      }, 5000);
    } catch (err) {
      console.error(err);
      next();
    }
  }
}
