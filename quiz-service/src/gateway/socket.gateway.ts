import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RECEIVED_EVENTS, SENT_EVENTS } from './socket.events';
import { SocketService } from './socket.service';

@WebSocketGateway({
  path: '/sockets/quiz',
  namespace: 'sockets/quiz',
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer() private server: Server;

  async handleConnection(client: Socket) {
    console.log('new connection');
    const payload = client.handshake.headers;
    await this.socketService.authenticate(payload.authorization, client);
  }

  @SubscribeMessage(RECEIVED_EVENTS.START_QUIZ)
  async handleStartQuiz(
    @MessageBody('quizId') quizId,
    @ConnectedSocket() client,
  ) {
    try {
      if (!quizId) {
        client.emit(SENT_EVENTS.ERROR, 'quizId is required');
      }
      const canParticipate = await this.socketService.canParticipateQuiz(
        client?.user?.id,
        quizId,
      );
      if (!canParticipate) {
        client.emit(SENT_EVENTS.ERROR, 'already participated at this quiz');
      }
      const quiz = await this.socketService.getQuiz(quizId);
      if (!quiz) {
        client.emit(SENT_EVENTS.ERROR, 'quiz not found');
      }
      const questions = await this.socketService.getQuestions(quizId);
      client.emit(SENT_EVENTS.NEW_QUESTION, {
        questions,
      });
    } catch (err) {
      client.emit(SENT_EVENTS.ERROR, err.message);
    }
  }

  @SubscribeMessage(RECEIVED_EVENTS.ANSWER_QUESTION)
  async handleAnswerQuestion(
    @MessageBody('questionId') questionId,
    @ConnectedSocket() client,
  ) {
    console.log('onéla');
  }
}
