import './tracing';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RatFlowInterceptor } from './interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: process.env.PORT || 3000,
    },
  });
  app.useGlobalInterceptors(
    new RatFlowInterceptor({
      appId: process.env.RATFLOW_APP_ID ?? 'app',
      appSecret: process.env.RATFLOW_APP_SECRET ?? 'secret',
      service: 'gateway-service',
      immediate: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
}

bootstrap();
