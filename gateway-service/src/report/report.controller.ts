import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('report')
export class ReportController {
  constructor(
    @Inject('REPORT_SERVICE') private readonly reportService: ClientProxy,
  ) {}

  @Get()
  public getReportHello() {
    return this.reportService.send('getHello', {});
  }
}
