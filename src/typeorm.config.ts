import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from './orders/order.entity';
import { User } from './users/user.entity';
import * as dotenv from 'dotenv';

// Carga el .env antes de usar las variables
dotenv.config();

const isDocker = process.env.APP_ENV === 'docker';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: isDocker ? 'postgres' : 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'gerry123',
  database: process.env.POSTGRES_DB || 'DataBase',
  entities: [Order, User],
  synchronize: true,
};


