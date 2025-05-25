import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // ✅ Este es el correcto
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersEventsController } from './events/orders.events.controller';
import { Order } from './order.entity';
import { typeOrmConfig } from '../typeorm.config';

@Module({
  imports: [
    CacheModule.register(), // 👈 Necesario para el CACHE_MANAGER en listener
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrdersController, OrdersEventsController],
  providers: [OrdersService],
})
export class OrdersModule {}
