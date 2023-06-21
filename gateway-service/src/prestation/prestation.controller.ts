import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  @Get('admin/all')
  @Roles(ROLE.ADMIN)
  public getAllPrestationsAdmin() {
    return this.prestationService.send('PRESTATION.GET_ALL_ADMIN', {});
  }

  @Get('self')
  public getSelf(@Req() req: any) {
    return this.prestationService.send('PRESTATION.GET_PRESTATIONS_OF_USER', {
      userId: req.user._id,
    });
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/prestation',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = uniqueSuffix + ext;
          cb(null, filename);
        },
      }),
    }),
  )
  public updatePrestation(
    @Req() req: any,
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() body,
  ) {
    body as UpdatePrestationDto;
    return this.prestationService.send('PRESTATION.UPDATE_ONE', {
      id: prestationId,
      prestation: body,
      image: `${req.protocol}://${req.get('Host')}/${image.path}`,
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

  @Get('user/:userId')
  public getUserPrestations(
    @Param('userId', CheckObjectIdPipe) userId: string,
  ) {
    return this.prestationService.send('PRESTATION.GET_PRESTATIONS_OF_USER', {
      userId,
      active: true,
    });
  }

  @Post()
  @Roles(ROLE.FREELANCER)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/prestation',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = uniqueSuffix + ext;
          cb(null, filename);
        },
      }),
    }),
  )
  public createPrestation(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() body,
  ) {
    body = body as CreatePrestationDto;
    return this.prestationService.send('PRESTATION.CREATE', {
      user: req.user._id,
      prestation: body,
      image: `${req.protocol}://${req.get('Host')}/${image.path}`,
    });
  }
}
