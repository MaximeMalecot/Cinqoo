import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';
import { ROLE } from 'src/enums/role.enum';
import { QuizService } from 'src/quiz/quiz.service';
import { ResultService } from 'src/results/result.service';
import { SENT_EVENTS } from './socket.events';

@Injectable()
export class SocketService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly resultService: ResultService,
    private readonly quizService: QuizService,
  ) {}

  public async authenticate(bearer_token: string, socket: Socket) {
    try {
      const token = this.extractToken(bearer_token);
      const payload = await firstValueFrom(
        this.authService.send('decode_token', { token }),
      );
      if (!payload) {
        throw new WsException('Invalid token');
      }
      const user = await firstValueFrom(
        this.userService.send('getUserById', { id: payload.sub }),
      );
      if (!user) {
        throw new WsException('User not found');
      }
      // 💡 We're assigning the payload to the socket object here
      // so that we can access it in our event handlers
      if (
        !user.roles.includes(ROLE.ADMIN) &&
        !user.roles.includes(ROLE.FREELANCER)
      ) {
        throw new WsException('Forbidden ressource');
      }
      socket['user'] = user;
    } catch (err) {
      socket.emit(SENT_EVENTS.ERROR, err.message);
      socket.disconnect();
    }
  }

  public async canParticipateQuiz(userId: string, quizId: string) {
    return await this.resultService.canParticipateQuiz(userId, quizId);
  }

  public async getQuiz(quizId: string) {
    return await this.quizService.getFullQuiz(quizId);
  }

  public async getQuestions(quizId: string) {
    return await this.quizService.getPublicQuestions(quizId);
  }

  private extractToken(fullToken: string): string | undefined {
    const [type, token] = fullToken.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };
}
