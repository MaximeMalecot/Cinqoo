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
}
