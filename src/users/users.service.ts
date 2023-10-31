import { ConflictException, Injectable } from '@nestjs/common';
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

    const { password, departmentId, ...rest } = data;

    return this.userRepository.create({
      ...rest,
      department: { connect: { id: data.departmentId } },
      encryptedPassword: await bcrypt.hash(
        password,
        this.configService.get('BCRYPT_SALT_ROUNDS') ?? DEFAULT_SALT_ROUNDS,
      ),
    });
  }

  async getByEmail(email: string) {
    return this.userRepository.getByEmail(email);
  }
}
