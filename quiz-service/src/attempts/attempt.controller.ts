import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AttemptService } from './attempt.service';

@Controller()
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @EventPattern('ATTEMPT.GET_ALL')
  public getAttempts() {
    return this.attemptService.getAttempts();
  }
}
