import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuizModule } from './quiz/quiz.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [ConfigModule.forRoot(), SocketModule, QuizModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
