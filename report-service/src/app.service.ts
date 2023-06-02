import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './schema/report.schema';
import { Model } from 'mongoose';
import { ReportReason } from './schema/report-reason.schema';

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
