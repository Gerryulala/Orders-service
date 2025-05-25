import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrometheusModule.register(), // <--- Agregado para métricas
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'gerry123',
      database: 'DataBase',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ desactiva en producción
    }),
    OrdersModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
