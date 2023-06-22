import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReportReason,
  ReportReasonSchema,
} from '../report-reason/schema/report-reason.schema';
import { Report, ReportSchema } from '../report/schema/report.schema';
import { AppController } from './report.controller';
import { AppService } from './report.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    MongooseModule.forFeature([
      { name: ReportReason.name, schema: ReportReasonSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class ReportModule {}
