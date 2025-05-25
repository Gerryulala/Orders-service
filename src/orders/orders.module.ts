import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { OrdersEventsController } from './orders.events.controller';
import { typeOrmConfig } from '../typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Order])
  ], 
  controllers: [OrdersController, OrdersEventsController],
  providers: [OrdersService],
})
export class OrdersModule {}
