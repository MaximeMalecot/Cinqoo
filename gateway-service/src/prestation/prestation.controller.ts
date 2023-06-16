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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { IsServiceAccessible } from './guards/is-service-accessible.guard';
import { IsServiceOwner } from './guards/is-service-owner.guard';

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
  @Public()
  @UseGuards(IsServiceAccessible) // If the prestation is not active, only the owner or an admin can access it with a valid token
  public getPrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.prestationService.send('PRESTATION.GET_ONE', prestationId);
  }

  @Patch(':prestationId')
  @UseGuards(IsServiceOwner)
  public updatePrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
    @Body() body: UpdatePrestationDto,
  ) {
    return this.prestationService.send('PRESTATION.UPDATE_ONE', {
      id: prestationId,
      prestation: body,
    });
  }

  @Patch('enable/:prestationId')
  @UseGuards(IsServiceOwner)
  public enablePrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.prestationService.send('PRESTATION.ENABLE_ONE', prestationId);
  }

  @Patch('disable/:prestationId')
  @UseGuards(IsServiceOwner)
  public disablePrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.prestationService.send('PRESTATION.DISABLE_ONE', prestationId);
  }

  @Delete(':prestationId')
  @UseGuards(IsServiceOwner)
  public deletePrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.prestationService.send('PRESTATION.DELETE_ONE', prestationId);
  }

  //To do: Only return active prestations
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
  @Roles(ROLE.FREELANCER)
  public createPrestation(@Body() body: CreatePrestationDto, @Req() req: any) {
    return this.prestationService.send('PRESTATION.CREATE', {
      user: req.user,
      prestation: body,
    });
  }
}
