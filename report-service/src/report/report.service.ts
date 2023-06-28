import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Report } from '../report/schema/report.schema';
import { ReportReason } from './../report-reason/schema/report-reason.schema';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    @InjectModel(ReportReason.name)
    private reportReasonModel: Model<ReportReason>,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationServiceClient: ClientProxy,
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
        target: serviceId,
        type: 'SERVICE',
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
        type: 'USER',
      });
      return res;
    } catch (error) {
      throw new RpcException({
        message: `Error while getting reports by user`,
        statusCode: 400,
      });
    }
  }

  async createReportOnUser(data: CreateReportDto) {
    try {
      const user = await firstValueFrom(
        this.userServiceClient.send('getUserById', { id: data.target }),
      );
      if (!user) {
        throw new RpcException({
          message: `The target isn't a user or this user doesn't exist`,
          statusCode: 400,
        });
      }
      const reportReason = await this.reportReasonModel.findById(
        data.reportReason,
      );
      if (!reportReason) {
        throw new RpcException({
          message: `This report reason doesn't exist`,
          statusCode: 400,
        });
      }
      if (reportReason.type !== 'USER') {
        throw new RpcException({
          message: `This report reason isn't for a user`,
          statusCode: 400,
        });
      }
      return this.createReport(data, 'USER');
    } catch (err) {
      if (err instanceof RpcException) throw err;
      if (err.message && err.statusCode)
        throw new RpcException({
          message: err.message,
          statusCode: err.statusCode,
        });
      throw new RpcException({
        message: `Error while creating report on user`,
        statusCode: 500,
      });
    }
  }
  async createReportOnService(data: CreateReportDto) {
    try {
      const service = await firstValueFrom(
        this.prestationServiceClient.send('PRESTATION.GET_ONE', data.target),
      );
      if (!service) {
        throw new RpcException({
          message: `The target isn't a service or this service doesn't exist`,
          statusCode: 400,
        });
      }
      const reportReason = await this.reportReasonModel.findById(
        data.reportReason,
      );
      if (!reportReason) {
        throw new RpcException({
          message: `This report reason doesn't exist`,
          statusCode: 400,
        });
      }
      if (reportReason.type !== 'SERVICE') {
        throw new RpcException({
          message: `This report reason isn't for a service`,
          statusCode: 400,
        });
      }
      return this.createReport(data, 'SERVICE');
    } catch (err) {
      if (err instanceof RpcException) throw err;
      if (err.message && err.statusCode)
        throw new RpcException({
          message: err.message,
          statusCode: err.statusCode,
        });
      throw new RpcException({
        message: `Error while creating report on service`,
        statusCode: 500,
      });
    }
  }

  async createReport(data: CreateReportDto, type: 'SERVICE' | 'USER') {
    const exists = await this.reportModel.find({
      target: data.target,
      creator: data.creator,
    });
    if (exists.length > 0) {
      throw new RpcException({
        message: `You have already reported this service`,
        statusCode: 400,
      });
    }
    const report = new this.reportModel({
      type,
      target: data.target,
      creator: data.creator,
      reportReason: new Types.ObjectId(data.reportReason),
      description: data.description,
    });
    return await report.save();
  }
}
