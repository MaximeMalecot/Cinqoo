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
      let { questions } = quiz;
      if (questions.length === 0) {
        client.emit(SENT_EVENTS.ERROR, 'quiz has no questions');
        client.disconnect();
        return;
      }
      // shuffle questions
      this.socketService.shuffleArray(questions);
      client.variables = {
        quiz,
        questions,
        current: 0,
        points: 0,
      };
      const question = client.variables.questions[
        client.variables.current
      ].answers.map((answer) => {
        delete answer.isRight;
        return answer;
      });
      console.log(question);
      client.emit(SENT_EVENTS.NEW_QUESTION, question);
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
