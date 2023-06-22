import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
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

  @Post()
  public createReport(@Body() body: CreateReportReasonDto) {
    return this.reportService.send('REPORT.CREATE', body);
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

  @Patch('/:reportReasonId')
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
