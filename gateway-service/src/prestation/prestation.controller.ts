import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';

@ApiTags('prestation')
@Controller('prestation')
export class PrestationController {
  constructor(
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

  @Get()
  public getAllPrestations() {
    return this.prestationService.send('PRESTATION.GET_ALL', {});
  }

  @Get('self')
  public getSelf(@Req() req: any) {
    return this.prestationService.send(
      'PRESTATION.GET_PRESTATIONS_OF_USER',
      req.user._id,
    );
  }

  @Get(':prestationId')
  public getPrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.prestationService.send('PRESTATION.GET_ONE', prestationId);
  }

  @Patch(':prestationId')
  public updatePrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
    @Body() body: UpdatePrestationDto,
  ) {
    return this.prestationService.send('PRESTATION.UPDATE_ONE', {
      id: prestationId,
      prestation: body,
    });
  }

  @Delete(':prestationId')
  public deletePrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.prestationService.send('PRESTATION.DELETE_ONE', prestationId);
  }

  @Get('user/:userId')
  public getUserPrestations(
    @Param('userId', CheckObjectIdPipe) userId: string,
  ) {
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
