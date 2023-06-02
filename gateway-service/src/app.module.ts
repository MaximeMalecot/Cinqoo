import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrestationModule } from './prestation/prestation.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';
import { ReportModule } from './report/report.module';
import { OrderModule } from './order/order.module';
import { DeliverableModule } from './deliverable/deliverable.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrestationModule,
    ReviewModule,
    PaymentModule,
    ReportModule,
    OrderModule,
    DeliverableModule,
    FavoriteModule
  ],
  controllers: [AppController],
})
export class AppModule {}
