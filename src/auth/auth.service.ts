import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JWTPayload, TokenAndCookieOptions, TokenRefreshPayload, toJWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenInvalidException } from './refresh.exception';

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

  async validateRefreshAndGenerateAccessToken(userId: number, refreshToken: string): Promise<TokenRefreshPayload> {
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');
    console.log ('user.refreshToken', user.refreshToken);
    console.log ('refreshToken', refreshToken);
    if (user.refreshToken !== refreshToken) throw new RefreshTokenInvalidException();

    const payload: JWTPayload = { id: user.id, isAdmin: user.isAdmin };
    return { ...payload, access: this.getAccessTokenAndOptions(payload) };
  }

  getAccessTokenAndOptions(payload: JWTPayload): TokenAndCookieOptions {
    const token = this.jwtService.sign(toJWTPayload(payload), {
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

  getRefreshTokenAndOptions(payload: JWTPayload): TokenAndCookieOptions {
    const token = this.jwtService.sign(toJWTPayload(payload), {
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
