import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { PublishDto } from './dto/publish.dto';
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
    return this.deliverableService.send(
      'DELIVERABLE.GET_ALL_FOR_ORDER',
      orderId,
    );
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/deliverables',
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
  @Post(':orderId')
  @Roles(ROLE.FREELANCER)
  @UseGuards(IsAllowedToPublish)
  public publishDeliverable(
    @Req() req: any,
    @Param('orderId', CheckObjectIdPipe) orderId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf|zip|rar)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: PublishDto,
  ) {
    const fileUrl = `${req.protocol}://${req.get('Host')}/${file.path}`;
    return this.deliverableService.send('DELIVERABLE.PUBLISH_FOR_ORDER', {
      orderId,
      ...body,
      link: fileUrl,
    });
  }
}
