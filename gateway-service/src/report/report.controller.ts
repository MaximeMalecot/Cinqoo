import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportReasonDto } from './dto/update-report-reason.dto';
import { ReportType } from './enums/report.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(
    @Inject('REPORT_SERVICE') private readonly reportService: ClientProxy,
  ) {}

  @Public()
  @Get('/reason')
  public getAllReportReasons() {
    return this.reportService.send('REPORT_REASON.GET_ALL', {});
  }

  @Public()
  @Get('/reason/service')
  public getServiceReportReasons() {
    return this.reportService.send('REPORT_REASON.GET_ALL', {
      type: ReportType.SERVICE,
    });
  }

  @Public()
  @Get('/reason/user')
  public getUserReportReasons() {
    return this.reportService.send('REPORT_REASON.GET_ALL', {
      type: ReportType.USER,
    });
  }

  @Get('/')
  @Roles(ROLE.ADMIN)
  public getAllReports() {
    return this.reportService.send('REPORT.GET_ALL', {});
  }

  @Get('/service/:serviceId')
  @Roles(ROLE.ADMIN)
  public getReportByService(
    @Param('serviceId', CheckObjectIdPipe) serviceId: string,
  ) {
    return this.reportService.send('REPORT.GET_BY_SERVICE', serviceId);
  }

  @Get('/user/:userId')
  @Roles(ROLE.ADMIN)
  public getReportByUser(@Param('userId', CheckObjectIdPipe) userId: string) {
    return this.reportService.send('REPORT.GET_BY_USER', userId);
  }

  @Post()
  public createReport(@Req() req: any, @Body() body: CreateReportDto) {
    return this.reportService.send('REPORT.CREATE', {
      userId: req.user._id,
      createReport: body,
    });
  }

  @Post('/reasonUser')
  @Roles(ROLE.ADMIN)
  public createReportReasonUser(@Body() body: CreateReportReasonDto) {
    return this.reportService.send('REPORT_REASON_USER.CREATE', body);
  }

  @Post('/reasonService')
  @Roles(ROLE.ADMIN)
  public createReportReasonService(@Body() body: CreateReportReasonDto) {
    return this.reportService.send('REPORT_REASON_SERVICE.CREATE', body);
  }

  @Patch('/reason/:reportReasonId')
  @Roles(ROLE.ADMIN)
  public updateReportReason(
    @Param('reportReasonId', CheckObjectIdPipe) reportReasonId: string,
    @Body() body: UpdateReportReasonDto,
  ) {
    return this.reportService.send('REPORT_REASON.UPDATE', {
      reportReasonId,
      updateReportReason: body,
    });
  }
}
