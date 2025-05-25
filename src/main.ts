import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilita CORS para tu frontend
  app.enableCors({
    origin: 'http://localhost:5173', // permite solo tu frontend
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // ✅ Conexión a microservicio RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        process.env.APP_ENV === 'docker'
          ? `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@rabbitmq:${process.env.RABBITMQ_PORT}`
          : `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@localhost:${process.env.RABBITMQ_PORT}`,
      ],
      queue: process.env.RABBITMQ_QUEUE || 'orders_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.APP_ENV === 'docker' ? 3000 : 3001);
}
bootstrap();
