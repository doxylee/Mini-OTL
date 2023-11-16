import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from 'src/common/dto/users/users.dto';
import { UserRepository } from 'src/prisma/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

// TODO: set default in configmodule
const DEFAULT_SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async createUser(data: CreateUserDTO) {
    if (await this.userRepository.getByEmail(data.email)) throw new ConflictException('Email already exists');

    const { password, ...rest } = data;

    return this.userRepository.create({
      ...rest,
      encryptedPassword: await bcrypt.hash(
        password,
        this.configService.get('BCRYPT_SALT_ROUNDS') ?? DEFAULT_SALT_ROUNDS,
      ),
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    return this.userRepository.updateRefreshToken(userId, refreshToken);
  }

  async getUserById(id: number) {
    const user = await this.userRepository.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserWithDeptById(id: number) {
    const user = await this.userRepository.getUserWithDeptById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async toggleAdmin(id: number) {
    const user = await this.getUserById(id);
    return this.userRepository.setAdmin(id, !user.isAdmin);
  }
}
