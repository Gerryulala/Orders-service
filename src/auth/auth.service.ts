import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const user = await this.usersService.create(email, password);
    return this.buildTokenResponse(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.buildTokenResponse(user);
  }

  private buildTokenResponse(user: User) {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return {
      token,             // antes: access_token
      user_id: user.id,  // 👈 agregado para el frontend
    };
  }
}
