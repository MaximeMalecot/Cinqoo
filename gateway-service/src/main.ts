import './tracing';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { tracker } from './express.lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    tracker({
      appId: process.env.RATFLOW_APP_ID ?? 'app',
      appSecret: process.env.RATFLOW_APP_SECRET ?? 'secret',
      service: 'gateway-service',
      immediate: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME ?? 'API')
    .setDescription(process.env.APP_DESCRIPTION ?? 'The API description')
    .setVersion(process.env.npm_package_version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
