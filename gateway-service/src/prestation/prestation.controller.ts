import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CreatePrestationDto } from './dto/create-prestation.dto';

@ApiTags('prestation')
@Controller('prestation')
export class PrestationController {
  constructor(
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

  @Get()
  public getPrestationHello() {
    return this.prestationService.send('PRESTATION.GET_HELLO', {});
  }

  @Get('self')
  public getSelf(@Req() req: any) {
    return this.prestationService.send(
      'PRESTATION.GET_PRESTATIONS_OF_USER',
      req.user._id,
    );
  }

  @Get(':userId')
  public getUserPrestations(@Param('userId') userId: string) {
    return this.prestationService.send(
      'PRESTATION.GET_PRESTATIONS_OF_USER',
      userId,
    );
  }

  @Post()
  public createPrestation(@Body() body: CreatePrestationDto, @Req() req: any) {
    return this.prestationService.send('PRESTATION.CREATE', {
      user: req.user,
      prestation: body,
    });
  }
}
