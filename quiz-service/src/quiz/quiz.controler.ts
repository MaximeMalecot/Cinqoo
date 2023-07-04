import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QuestionCreateDto } from './dto/question-create.dto';
import { RequestQuestionUpdateDto } from './dto/question-update.dto';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { QuizService } from './quiz.service';

@Controller()
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @EventPattern('QUIZ.GET_ALL')
  async getAll() {
    return await this.quizService.getAll();
  }

  @EventPattern('QUIZ.CREATE')
  async createQuiz(@Payload() data: QuizCreateDto) {
    return await this.quizService.createQuiz(data);
  }

  @EventPattern('QUIZ.CREATE_QUESTION')
  async createQuestion(@Payload() data: QuestionCreateDto) {
    return await this.quizService.createQuestion(data);
  }

  @EventPattern('QUIZ.UPDATE_QUESTION')
  async updateQuestion(@Payload() data: RequestQuestionUpdateDto) {
    const { questionId, ...rest } = data;
    return await this.quizService.updateQuestion(questionId, rest);
  }

  @EventPattern('QUIZ.DELETE_QUESTION')
  async deleteQuestion(questionId: string) {
    return await this.quizService.deleteQuestion(questionId);
  }

  @EventPattern('QUIZ.GET_FULL')
  async getFullQuiz(quizId: string) {
    return await this.quizService.getFullQuiz(quizId);
  }

  @EventPattern('QUIZ.GET_FULL_QUESTION')
  async getOneQuiz(questionId: string) {
    return await this.quizService.getFullQuestion(questionId);
  }
}
