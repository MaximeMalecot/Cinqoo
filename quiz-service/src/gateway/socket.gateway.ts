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
        throw new Error('quizId is required');
      }
      const canParticipate = await this.socketService.canParticipateQuiz(
        client?.user?.id,
        quizId,
      );
      if (!canParticipate) {
        throw new Error('you cannot participate at this quiz');
      }
      const quiz = await this.socketService.getQuiz(quizId);
      if (!quiz) {
        throw new Error('quiz not found');
      }

      let { questions } = quiz;
      if (questions.length === 0) {
        throw new Error('quiz has no questions');
      }

      // shuffle questions
      const randomQuestions = this.socketService.shuffleArray(questions);

      const variables = {
        quiz,
        questions: randomQuestions,
        current: 0,
        points: 0,
      };
      client.variables = variables;

      const payload = this.socketService.getQuestionPayload(
        variables.questions,
        0,
      );

      client.emit(SENT_EVENTS.NEW_QUESTION, payload);
    } catch (err) {
      client.emit(SENT_EVENTS.ERROR, err.message);
      client.disconnect();
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
