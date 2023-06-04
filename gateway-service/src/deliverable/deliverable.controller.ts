import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('deliverable')
@Controller('deliverable')
export class DeliverableController {
  constructor(
    @Inject('DELIVERABLE_SERVICE')
    private readonly deliverableService: ClientProxy,
  ) {}

  @Get()
  public getDeliverableHello() {
    console.log('getDeliverableHello');
    return this.deliverableService.send('getHello', {});
  }
}
