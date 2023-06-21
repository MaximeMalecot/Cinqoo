import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { IsAllowedToPublish } from './guards/is-allowed-to-publish';
import { IsAllowedToSeeOrder } from './guards/is-allowed-to-see-order.guard';

@ApiTags('deliverable')
@Controller('deliverable')
export class DeliverableController {
  constructor(
    @Inject('DELIVERABLE_SERVICE')
    private readonly deliverableService: ClientProxy,
  ) {}

  @UseGuards(IsAllowedToSeeOrder)
  @Get(':orderId')
  public getAllDeliverablesForAnOrder(
    @Param('orderId', CheckObjectIdPipe) orderId: string,
  ) {
    // return this.deliverableService.send(
    //   'DELIVERABLE.GET_ALL_FOR_ORDER',
    //   orderId,
    // );
    return 'not implemented yet';
  }

  @Post(':orderId')
  @Roles(ROLE.FREELANCER)
  @UseGuards(IsAllowedToPublish)
  public publishDeliverable(
    @Param('orderId', CheckObjectIdPipe) orderId: string,
    @Body() body: any,
  ) {
    // return this.deliverableService.send('DELIVERABLE.GET_ALL_FOR_ORDER', {
    //   orderId,
    //   data: body,
    // });
    return 'not implemented yet';
  }
}
