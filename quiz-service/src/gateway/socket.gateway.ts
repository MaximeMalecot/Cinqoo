import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  namespace: 'sockets/quiz',
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer() private server: Server;

  async handleConnection(client: Socket) {
    const payload = client.handshake.headers;
    await this.socketService.authenticate(payload.authorization, client);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
  }

  @SubscribeMessage('answer_quiz')
  async handleAnserQuiz(@MessageBody() body, @ConnectedSocket() client) {
    const canAnswer = await this.socketService.canAnswerQuiz(
      body.quizId,
      client?.user,
    );
    if (!canAnswer) {
      client.emit('error', 'already answered at this quiz');
    }
  }

  @SubscribeMessage('join_room')
  joinRoom(@MessageBody() body: any, @ConnectedSocket() client) {
    console.log(body, client?.user);
  }
}
