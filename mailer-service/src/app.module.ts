import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FROM, PORTS, SERVICES, TRANSPORTER } from './constants';
import { SendMailModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.USER,
          port: PORTS.USER,
        },
      },
    ]),
    SendMailModule.forRoot({
      transporter: TRANSPORTER,
      from: FROM,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
