import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommandModule } from 'nestjs-command';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DeliverableModule } from './deliverable/deliverable.module';
import { FavoriteModule } from './favorite/favorite.module';
import { MailerModule } from './mailer/mailer.module';
import { MessageModule } from './message/message.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { PrestationModule } from './prestation/prestation.module';
import { QuizModule } from './quiz/quiz.module';
import { ReportModule } from './report/report.module';
import { ReviewModule } from './review/review.module';
import { SeederModule } from './seeder/seeder.module';
import { SseModule } from './sse/sse.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PrestationModule,
    CategoryModule,
    ReviewModule,
    PaymentModule,
    ReportModule,
    MailerModule,
    OrderModule,
    DeliverableModule,
    FavoriteModule,
    WebhookModule,
    MulterModule.register({
      dest: './files',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
      serveRoot: '/files',
      serveStaticOptions: {
        index: false,
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 80,
    }),
    MessageModule,
    QuizModule,
    SseModule,
    CommandModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
