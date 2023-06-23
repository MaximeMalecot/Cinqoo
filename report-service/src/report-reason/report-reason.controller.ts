import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
import { UpdateReportReasonDto } from './dto/update-report-reason.dto';
import { ReportReasonService } from './report-reason.service';

@Controller()
export class ReportReasonController {
  constructor(private readonly reportReasonService: ReportReasonService) {}

  @EventPattern('getHello')
  async getHello(): Promise<string> {
    return await this.reportReasonService.getHello();
  }

  @EventPattern('REPORT_REASON.GETALL')
  async getAllReportReasons() {
    return await this.reportReasonService.getReportReasons();
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
    console.log(data);
    return await this.reportReasonService.updateReportReason(
      data.reportReasonId,
      data.updateReportReason,
    );
  }
}
