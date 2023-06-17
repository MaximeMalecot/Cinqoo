import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { SERVICES } from './constants';
import { AccountService } from './services/account.service';
import { PaymentService } from './services/payment-service';
import { WebhookService } from './services/webhook.service';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    StripeModule.forRoot(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    }),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PAYMENT,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [PaymentService, AccountService, WebhookService],
})
export class AppModule {}
