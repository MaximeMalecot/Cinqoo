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

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(
    @Inject('REPORT_SERVICE') private readonly reportService: ClientProxy,
  ) {}

  @Get()
  public getReportHello() {
    return this.reportService.send('getHello', {});
  }

  @Get('/reason/all')
  public getAllReportReasons() {
    return this.reportService.send('REPORT_REASON.GETALL', {});
  }

  @Get('/all')
  public getAllReports() {
    return this.reportService.send('REPORT.GETALL', {});
  }

  @Get('/service/:serviceId')
  public getReportByService(
    @Param('serviceId', CheckObjectIdPipe) serviceId: string,
  ) {
    return this.reportService.send('REPORT.GETBYSERVICE', serviceId);
  }

  @Get('/user/:userId')
  public getReportByUser(@Param('userId', CheckObjectIdPipe) userId: string) {
    return this.reportService.send('REPORT.GETBYUSER', userId);
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
