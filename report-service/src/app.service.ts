import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportReason } from './report-reason/schema/report-reason.schema';
import { Report } from './report/schema/report.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    @InjectModel(ReportReason.name)
    private reportReasonModel: Model<ReportReason>,
  ) {}

  async getHello(): Promise<string> {
    const reportCount = await this.reportModel.countDocuments();
    const reportReasonCount = await this.reportReasonModel.countDocuments();
    return `Report service : there are currently ${reportCount} reports in the database and ${reportReasonCount} report reasons in the database`;
  }
}
