import { Controller, Get, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UserDTO, toUserDTO } from 'src/common/dto/users/users.dto';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: JWTPayload }): Promise<UserDTO> {
    const user = await this.usersService.getById(req.user.id);
    if (!user) throw new NotFoundException('User not found');
    // TODO: Add more data to response
    return toUserDTO(user);
  }
}
