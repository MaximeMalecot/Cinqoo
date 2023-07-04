import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';

@Module({
  imports: [],
  controllers: [SocketController],
  providers: [],
})
export class SocketModule {}
