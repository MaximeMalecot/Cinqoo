import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PrestationService } from './prestation.service';

@Controller()
export class PrestationController {
  constructor(private readonly appService: PrestationService) {}

  @EventPattern('PRESTATION.GET_HELLO')
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
