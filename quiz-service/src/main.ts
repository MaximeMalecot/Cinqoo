import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RpcException, Transport } from '@nestjs/microservices';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';
import { PORTS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(
              process.env.npm_package_name,
            ),
          ),
        }),
      ],
    }),
  });

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: PORTS.QUIZ_MS,
    },
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        throw new RpcException({
          message: `Validation failed: ${
            errors[0].property
          } has wrong value ${JSON.stringify(errors[0].constraints)}`,
          statusCode: 400,
        });
      },
    }),
  );

  await app.startAllMicroservices();
  await app.listen(PORTS.QUIZ);
}
bootstrap();
