import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { CreateUserDTO, UserDTO, toUserDTO } from 'src/common/dto/users/users.dto';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request & { user: User }, @Res({ passthrough: true }) res: Response): Promise<UserDTO> {
    const payload: JWTPayload = { id: req.user.id, isAdmin: req.user.isAdmin };
    const access = this.authService.getAccessTokenAndOptions(payload);
    const refresh = this.authService.getRefreshTokenAndOptions(payload);

    console.log('login', req.user.id, refresh.token);
    await this.usersService.updateRefreshToken(req.user.id, refresh.token);

    // TODO: Update refresh token in db
    res.cookie('jwt', access.token, access.options);
    res.cookie('refresh', refresh.token, refresh.options);

    return toUserDTO(req.user);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDTO): Promise<UserDTO> {
    return toUserDTO(await this.usersService.createUser(body));
  }
}
