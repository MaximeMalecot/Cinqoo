import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReportType } from 'src/report/enums/report.enum';
import { Report } from '../report/schema/report.schema';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
import { UpdateReportReasonDto } from './dto/update-report-reason.dto';
import { ReportReason } from './schema/report-reason.schema';

@Injectable()
export class ReportReasonService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    @InjectModel(ReportReason.name)
    private reportReasonModel: Model<ReportReason>,
  ) {}

  async getReportReasons(type?: ReportType): Promise<ReportReason[]> {
    if (type) {
      return await this.reportReasonModel.find({ type: type });
    }
    return await this.reportReasonModel.find();
  }

  async getReportReason(reportReasonId: string) {
    const reportReason = await this.reportReasonModel.findById(
      new Types.ObjectId(reportReasonId),
    );
    if (!reportReason) {
      throw new RpcException({ code: 404 });
    }
    const reports = await this.reportModel.find({
      reportReason: new Types.ObjectId(reportReasonId),
    });
    return { ...reportReason.toJSON(), reports: reports };
  }

  async createReportReasonUser(data: CreateReportReasonDto) {
    try {
      const res = new this.reportReasonModel({
        name: data.name,
        description: data.description,
        type: ReportType.USER,
      });
      return await res.save();
    } catch (error) {
      throw new RpcException({ code: 500 });
    }
  }

  async createReportReasonService(data: CreateReportReasonDto) {
    try {
      const res = new this.reportReasonModel({
        name: data.name,
        description: data.description,
        type: ReportType.SERVICE,
      });
      return await res.save();
    } catch (error) {
      throw new RpcException({ code: 500 });
    }
  }

  async updateReportReason(
    id: string,
    updateReportReason: UpdateReportReasonDto,
  ) {
    const reportReason = await this.reportReasonModel.findById(
      new Types.ObjectId(id),
    );
    if (!reportReason) {
      throw new RpcException({
        message: `ReportReason with id ${id} not found`,
        statusCode: 404,
      });
    }
    try {
      await this.reportReasonModel.updateOne(
        { _id: new Types.ObjectId(id) },
        updateReportReason,
      );
      return {
        message: `ReportReason with id ${id} updated`,
      };
    } catch (error) {
      throw new RpcException({ code: 500 });
    }
  }
}
