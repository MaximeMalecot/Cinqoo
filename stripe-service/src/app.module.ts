import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PaymentService } from './services/payment-service';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { AccountService } from './services/account.service';
import { WebhookService } from './services/webhook.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    StripeModule.forRoot(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    }),
  ],
  controllers: [AppController],
  providers: [PaymentService, AccountService, WebhookService],
})
export class AppModule {}
