import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './typeorm.config';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => {
    const isDocker = process.env.APP_ENV === 'docker';
    return {
      store: redisStore,
      host: isDocker ? 'redis' : 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    };
  },
}),



    PrometheusModule.register(),
    TypeOrmModule.forRoot(typeOrmConfig),
    OrdersModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
