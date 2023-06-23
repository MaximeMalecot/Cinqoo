import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@Controller()
export class AppController {
  constructor(private readonly reportService: ReportService) {}

  @EventPattern('REPORT.GET_ALL')
  async getAllReports() {
    return await this.reportService.getAllReports();
  }

  @EventPattern('REPORT.GET_BY_SERVICE')
  async getReportByService(@Payload() serviceId: string) {
    return await this.reportService.getReportByService(serviceId);
  }

  @EventPattern('REPORT.GET_BY_USER')
  async getReportByUser(@Payload() userId: string) {
    return await this.reportService.getReportByUser(userId);
  }

  @EventPattern('REPORT.CREATE')
  async createReport(
    @Payload() data: { userId: string; createReport: CreateReportDto },
  ) {
    return await this.reportService.createReport(
      data.userId,
      data.createReport,
    );
  }
}
