import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "auth-service",
          port: 3001
        }
      },
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "user-service",
          port: 3002
        }
      },
      {
        name: "PRESTATION_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "prestation-service",
          port: 3003
        }
      },
      {
        name: "REVIEW_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "review-service",
          port: 3004
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
