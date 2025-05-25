// src/main.listener.ts
import { NestFactory } from '@nestjs/core';
import { OrdersModule } from '../orders/orders.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(OrdersModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'orders_queue',
      queueOptions: { durable: false },
    },
  });

  await app.listen();
  console.log('✅ Microservicio escuchando eventos de RabbitMQ...');
}
bootstrap();
