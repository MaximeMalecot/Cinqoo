import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { QuizService } from './quiz.service';

@Controller()
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @EventPattern('QUIZ.HELLO')
  async getMsHello(): Promise<string> {
    return await this.quizService.getMsHello();
  }

  @EventPattern('QUIZ.CREATE')
  async createQuiz(@Payload() data: QuizCreateDto) {
    return await this.quizService.createQuiz(data);
  }
}
