import { Controller, Get, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO, toUserDTO } from 'src/common/dto/users/users.dto';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@JWTUser() jwt: JWTPayload): Promise<UserDTO> {
    const user = await this.usersService.getById(jwt.id);
    if (!user) throw new NotFoundException('User not found');
    // TODO: Add more data to response
    return toUserDTO(user);
  }
}
