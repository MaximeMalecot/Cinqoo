import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReportType } from '../report/enums/report.enum';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
import { UpdateReportReasonDto } from './dto/update-report-reason.dto';
import { ReportReasonService } from './report-reason.service';

@Controller()
export class ReportReasonController {
  constructor(private readonly reportReasonService: ReportReasonService) {}

  @EventPattern('REPORT_REASON.GET_ALL')
  async getAllReportReasons(@Payload() data: { type?: ReportType }) {
    return await this.reportReasonService.getReportReasons(
      data.type ? data.type : undefined,
    );
  }

  @EventPattern('REPORT_REASON.GET_ONE')
  async getReportReason(reportReasonId: string) {
    return await this.reportReasonService.getReportReason(reportReasonId);
  }

  @EventPattern('REPORT_REASON_USER.CREATE')
  async createReportReasonUser(@Payload() reportReason: CreateReportReasonDto) {
    return this.reportReasonService.createReportReasonUser(reportReason);
  }

  @EventPattern('REPORT_REASON_SERVICE.CREATE')
  async createReportReasonService(
    @Payload() reportReason: CreateReportReasonDto,
  ) {
    return this.reportReasonService.createReportReasonService(reportReason);
  }

  @EventPattern('REPORT_REASON.UPDATE')
  async updateReportReason(
    @Payload()
    data: {
      reportReasonId: string;
      updateReportReason: UpdateReportReasonDto;
    },
  ) {
    return await this.reportReasonService.updateReportReason(
      data.reportReasonId,
      data.updateReportReason,
    );
  }
}
