import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@Controller()
export class AppController {
  constructor(private readonly reportService: ReportService) {}

  @EventPattern('getHello')
  async getHello(): Promise<string> {
    return await this.reportService.getHello();
  }

  @EventPattern('REPORT.CREATE')
  async createReportService(
    @Payload() data: { userId: string; createReport: CreateReportDto },
  ) {
    return this.reportService.createReport(data.userId, data.createReport);
  }
}
