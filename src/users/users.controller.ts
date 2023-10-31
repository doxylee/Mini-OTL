import { Body, Controller, Get, Post, Req, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDTO, LoginRequestDTO, UserDTO, toUserDTO } from 'src/common/dto/users/users.dto';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { User } from '@prisma/client';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request & { user: User }, @Res({ passthrough: true }) res: Response): Promise<UserDTO> {
    const userDTO = toUserDTO(req.user);
    const access = await this.authService.getAccessTokenAndOptions(userDTO);
    const refresh = await this.authService.getRefreshTokenAndOptions(userDTO);

    // TODO: Update refresh token in db
    res.cookie('jwt', access.token, access.options);
    res.cookie('refresh', refresh.token, refresh.options);

    return userDTO;
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDTO): Promise<UserDTO> {
    return toUserDTO(await this.usersService.createUser(body));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: JWTPayload }): Promise<UserDTO> {
    const user = await this.usersService.getById(req.user.id);
    if (!user) throw new NotFoundException('User not found');
    // TODO: Add more data to response
    return toUserDTO(user);
  }
}
