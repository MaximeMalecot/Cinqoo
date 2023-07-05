import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ResultService } from './result.service';

@Controller()
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @EventPattern('RESULT.GET_ALL')
  public getResults() {
    return this.resultService.getResults();
  }

  @EventPattern('RESULT.GET_RESULTS_OF_USER')
  public getResultsOfUser(userId: string) {
    return this.resultService.getResultsOfUser(userId);
  }

  @EventPattern('RESULT.GET_SUCCES_OF_USER')
  public getSuccessOfUser(userId: string) {
    return this.resultService.getSuccessOfUser(userId);
  }

  @EventPattern('RESULT.GET_RESULT_OF_QUIZ_FOR_USER')
  public getResultOfQuiz(
    @Payload('userId') userId: string,
    @Payload('quizId') quizId: string,
  ) {
    return this.resultService.getResultOfUserOnQuiz(userId, quizId);
  }
}
