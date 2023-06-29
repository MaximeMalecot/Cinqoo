import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';
import { CustomErrorInterceptor } from './interceptors/error.interceptor';

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
        new winston.transports.File({
          filename: `logs/error.log`,
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(
              process.env.npm_package_name,
              {
                colors: false,
                prettyPrint: false,
              },
            ),
          ),
        }),
        new winston.transports.File({
          filename: `logs/combined.log`,
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(
              process.env.npm_package_name,
              {
                colors: false,
                prettyPrint: false,
              },
            ),
          ),
        }),
      ],
    }),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new CustomErrorInterceptor());
  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME ?? 'API')
    .setDescription(process.env.APP_DESCRIPTION ?? 'The API description')
    .setVersion(process.env.npm_package_version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
  });
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    compression({
      filter: () => true,
      threshold: 0,
    }),
  );
  await app.listen(3000);
}
bootstrap();
