import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from './orders/order.entity';
import { User } from './users/user.entity/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'gerry123',
  database: process.env.POSTGRES_DB || 'DataBase',
  entities: [Order, User],
  synchronize: true,
};
