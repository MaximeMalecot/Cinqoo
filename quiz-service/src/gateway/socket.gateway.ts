import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'sockets/quiz',
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  private server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
