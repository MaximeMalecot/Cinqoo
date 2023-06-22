import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from '.././report/schema/report.schema';
import { ReportReasonController } from './report-reason.controller';
import { ReportReasonService } from './report-reason.service';
import {
  ReportReason,
  ReportReasonSchema,
} from './schema/report-reason.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    MongooseModule.forFeature([
      { name: ReportReason.name, schema: ReportReasonSchema },
    ]),
  ],
  controllers: [ReportReasonController],
  providers: [ReportReasonService],
})
export class ReportReasonModule {}
