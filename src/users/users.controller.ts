import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDTO, LoginRequestDTO, UserDTO, toUserDTO } from 'src/common/dto/users/users.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDTO): Promise<UserDTO> {
    return toUserDTO(await this.usersService.createUser(body));
  }
}
