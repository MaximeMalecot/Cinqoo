import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DeliverableModule } from './deliverable/deliverable.module';
import { FavoriteModule } from './favorite/favorite.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { PrestationModule } from './prestation/prestation.module';
import { ReportModule } from './report/report.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrestationModule,
    CategoryModule,
    ReviewModule,
    PaymentModule,
    ReportModule,
    OrderModule,
    DeliverableModule,
    FavoriteModule,
    WebhookModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
