import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportReasonModule } from './report-reason/report-reason.module';
import {
  ReportReason,
  ReportReasonSchema,
} from './report-reason/schema/report-reason.schema';
import { ReportModule } from './report/report.module';
import { Report, ReportSchema } from './report/schema/report.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    MongooseModule.forFeature([
      { name: ReportReason.name, schema: ReportReasonSchema },
    ]),
    ReportModule,
    ReportReasonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
