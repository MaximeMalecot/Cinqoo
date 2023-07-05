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

interface CLIENT_VARIABLES {
  quiz: any;
  questions: any[];
  current: number;
  points: number;
  warnings: number;
}

const MAX_WARNINGS = 2;
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
      const result = await this.socketService.getQuizResult(
        client?.user?.id,
        quizId,
      );
      if (result) {
        if (result.success) {
          client.emit(SENT_EVENTS.QUIZ_OVER, { results: result.score });
          throw new Error('you already succeded at this quiz');
        }
        client.emit(SENT_EVENTS.QUIZ_OVER, { results: result.score });
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
        warnings: 0,
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
    @MessageBody('answers') answers: string[],
    @ConnectedSocket() client,
  ) {
    try {
      const { current, questions, points } = client.variables;
      const question = questions[current];

      if (!question) {
        throw new Error('question not found');
      }

      console.log('answers', answers);
      const rightAnswers = question.answers
        .filter((a) => a.isRight)
        .map((a) => a._id.toString());

      // algo to compares if the two arrays of string are equal
      const isRight =
        answers.length === rightAnswers.length &&
        answers.every((value, index) => value === rightAnswers[index]);

      if (isRight) {
        client.variables.points = points + 1;
      }

      const next = current + 1;
      const payload = this.socketService.getQuestionPayload(questions, next);

      if (!payload) {
        this.handleResult(client);
        return;
      } else {
        client.variables.current = next;
        client.emit(SENT_EVENTS.NEW_QUESTION, payload);
      }
    } catch (e: any) {
      client.emit(SENT_EVENTS.ERROR, e.message);
      // client.disconnect();
    }
  }

  @SubscribeMessage(RECEIVED_EVENTS.TAB_HIDDEN)
  async handleTabHidden(@ConnectedSocket() client) {
    const { warnings } = client.variables;
    if (warnings >= MAX_WARNINGS) {
      client.emit(SENT_EVENTS.QUIZ_OVER, {
        results: client.variables.points,
      });
      client.disconnect();
    } else {
      client.variables.warnings = warnings + 1;
      client.emit(SENT_EVENTS.WARNING, {
        message: "It looks like you're not focused on the quiz.",
        warnings: client.variables.warnings,
      });
    }
  }

  private handleResult(client) {
    const { points } = client.variables;
    const percentage = (points / client.variables.questions.length) * 100;
    this.socketService.saveResult(
      client.user.id,
      client.variables.quiz._id,
      percentage,
    );

    client.emit(SENT_EVENTS.QUIZ_OVER, {
      results: percentage,
    });
    client.disconnect();
  }
}
