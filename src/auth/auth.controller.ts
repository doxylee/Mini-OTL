import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { CreateUserDTO, UserDTO, toUserDTO } from 'src/common/dto/users/users.dto';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request & { user: User }, @Res({ passthrough: true }) res: Response): Promise<UserDTO> {
    await this.setupTokens(req.user, res);
    return toUserDTO(req.user);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDTO): Promise<UserDTO> {
    return toUserDTO(await this.usersService.createUser(body));
  }

  @UseGuards(JwtAuthGuard)
  @Post('toggleAdmin')
  async toggleAdmin(@JWTUser() user: JWTPayload, @Res({ passthrough: true }) res: Response): Promise<UserDTO> {
    const updated = await this.usersService.toggleAdmin(user.id);
    await this.setupTokens(updated, res);

    return toUserDTO(updated);
  }

  private async setupTokens(user: User, res: Response) {
    const payload: JWTPayload = { id: user.id, isAdmin: user.isAdmin };
    const access = this.authService.getAccessTokenAndOptions(payload);
    const refresh = this.authService.getRefreshTokenAndOptions(payload);

    await this.usersService.updateRefreshToken(user.id, refresh.token);

    res.cookie('jwt', access.token, access.options);
    res.cookie('refresh', refresh.token, refresh.options);
  }
}
