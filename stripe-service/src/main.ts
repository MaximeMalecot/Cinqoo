import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcException, Transport } from '@nestjs/microservices';
import { PORTS } from './constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: PORTS.STRIPE,
    },
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
  await app.listen();
}
bootstrap();
