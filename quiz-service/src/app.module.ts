import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controler';
import { GatewayModule } from './gateway/gateway.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [ConfigModule.forRoot(), QuizModule, GatewayModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
