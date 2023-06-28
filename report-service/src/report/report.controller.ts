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

  @EventPattern('REPORT.GET_ON_USER')
  async getReportsOnUser(@Payload() userId: string) {
    return await this.reportService.getReportsOnUser(userId);
  }

  @EventPattern('REPORT.GET_FULL_USER')
  async getFullUser(@Payload() userId: string) {
    return await this.reportService.getFullUser(userId);
  }

  @EventPattern('REPORT.CREATE_ON_USER')
  async createReportOnUser(@Payload() data: CreateReportDto) {
    return await this.reportService.createReportOnUser(data);
  }

  @EventPattern('REPORT.CREATE_ON_SERVICE')
  async createReportOnService(@Payload() data: CreateReportDto) {
    return await this.reportService.createReportOnService(data);
  }
}
