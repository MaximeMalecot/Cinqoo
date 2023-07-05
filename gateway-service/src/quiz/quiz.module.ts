import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { QuizController } from './quiz.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QUIZ_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.QUIZ,
          port: PORTS.QUIZ_MS,
        },
      },
    ]),
  ],
  controllers: [QuizController],
})
export class QuizModule {}
