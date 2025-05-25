import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 Registro del repositorio
  providers: [UsersService],
  exports: [UsersService], // 👈 Importante para que AuthService lo use
})
export class UsersModule {}
