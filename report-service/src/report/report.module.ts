import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { PORTS, SERVICES } from 'src/constants';
import {
  ReportReason,
  ReportReasonSchema,
} from '../report-reason/schema/report-reason.schema';
import { Report, ReportSchema } from '../report/schema/report.schema';
import { AppController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    MongooseModule.forFeature([
      { name: ReportReason.name, schema: ReportReasonSchema },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.USER,
          port: PORTS.USER,
        },
      },
      {
        name: 'PRESTATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PRESTATION,
          port: PORTS.PRESTATION,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [ReportService],
})
export class ReportModule {}
