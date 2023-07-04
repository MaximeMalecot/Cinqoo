import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { QuizService } from './quiz.service';

@Controller()
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @EventPattern('QUIZ.HELLO')
  async getMsHello(): Promise<string> {
    return await this.quizService.getMsHello();
  }
}
