import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REPORT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'report-service',
          port: 3005,
        },
      },
    ]),
  ],
  controllers: [ReportController],
})
export class ReportModule {}
