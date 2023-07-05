import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
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
}
