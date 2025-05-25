import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigModule } from '@nestjs/config'; // ← 👈 necesario
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './typeorm.config';


@Module({
  imports: [
    // 🔧 Carga variables de entorno automáticamente desde .env
    ConfigModule.forRoot({
      isGlobal: true, // hace que esté disponible en todo el proyecto
    }),

    PrometheusModule.register(),
    TypeOrmModule.forRoot(typeOrmConfig),


    OrdersModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }
