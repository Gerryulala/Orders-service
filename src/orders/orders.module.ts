import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersEventsController } from './events/orders.events.controller';
import { Order } from './order.entity';
import { typeOrmConfig } from '../typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 carga .env
    CacheModule.register({
      ttl: parseInt(process.env.REDIS_TTL || '600'),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrdersController, OrdersEventsController],
  providers: [OrdersService],
})
export class OrdersModule {}
