import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CustomErrorInterceptor } from './interceptors/error.interceptor';
import './tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new CustomErrorInterceptor());
  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME ?? 'API')
    .setDescription(process.env.APP_DESCRIPTION ?? 'The API description')
    .setVersion(process.env.npm_package_version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
  });
  app.use(helmet());
  SwaggerModule.setup('docs', app, document);
  app.use(helmet({ crossOriginResourcePolicy: false }));
  await app.listen(3000);
}
bootstrap();
