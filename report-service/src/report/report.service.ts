import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report } from '../report/schema/report.schema';
import { ReportReason } from './../report-reason/schema/report-reason.schema';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
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

  async getAllReports() {
    try {
      return await this.reportModel.find();
    } catch (error) {
      throw new RpcException({
        message: `Error while getting all reports`,
        statusCode: 400,
      });
    }
  }

  async getReportByService(serviceId: string) {
    try {
      return await this.reportModel.find({
        service: serviceId,
      });
    } catch (error) {
      throw new RpcException({
        message: `Error while getting reports by service`,
        statusCode: 400,
      });
    }
  }

  async getReportByUser(userId: string) {
    try {
      const res = await this.reportModel.find({
        target: userId,
      });
      return res;
    } catch (error) {
      throw new RpcException({
        message: `Error while getting reports by user`,
        statusCode: 400,
      });
    }
  }

  async createReport(userId: string, report: CreateReportDto) {
    const ReportReason = await this.reportReasonModel.findById(
      new Types.ObjectId(report.reportReason),
    );
    if (!ReportReason) {
      throw new RpcException({
        message: `This report reason doesn't exist`,
        statusCode: 400,
      });
    }
    if (!report.service && !report.target) {
      throw new RpcException({
        message: `You must provide a service or a target`,
        statusCode: 400,
      });
    }
    const reportAlready = await this.reportModel.find({
      service: report.service,
      target: report.target,
      creator: userId,
    });
    if (reportAlready.length > 0) {
      throw new RpcException({
        message: `This User has already reported that`,
        statusCode: 400,
      });
    }
    try {
      const res = new this.reportModel({
        service: report.service,
        target: report.target,
        creator: userId,
        reason: report.reportReason,
        description: report.description,
      });
      return await res.save();
    } catch (error) {
      throw new RpcException({ code: 500 });
    }
  }
}
