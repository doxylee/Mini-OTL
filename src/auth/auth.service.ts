import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);

    if (user && (await bcrypt.compare(password, user.encryptedPassword))) {
      return user;
    }
    return null;
  }

  getAccessTokenAndOptions(payload: JWTPayload) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXP_SEC')}s`,
    });

    // TODO: domain, secure: true, httpOnly: true for production
    return {
      token,
      options: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: Number(this.configService.get('JWT_ACCESS_TOKEN_EXP_SEC')) * 1000,
      },
    };
  }

  getRefreshTokenAndOptions(payload: JWTPayload) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXP_SEC')}s`,
    });

    // TODO: domain, secure: true, httpOnly: true for production
    return {
      token,
      options: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: Number(this.configService.get('JWT_REFRESH_TOKEN_EXP_SEC')) * 1000,
      },
    };
  }
}
