import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REPORT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.REPORT,
          port: PORTS.REPORT,
        },
      },
    ]),
  ],
  controllers: [ReportController],
})
export class ReportModule {}
