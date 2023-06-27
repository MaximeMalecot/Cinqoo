import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { PORTS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: PORTS.HYBRID_MS,
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORTS.HYBRID);
}
bootstrap();
