// src/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from './orders/order.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'gerry123',
  database: 'DataBase',
  entities: [Order],
  synchronize: true,
};
