import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({
  namespace: 'sockets/quiz',
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
