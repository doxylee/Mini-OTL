import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserCreateDTO, UserWithDept } from './repository.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserCreateDTO): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        encryptedPassword: data.encryptedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        department: { connect: { id: data.departmentId } },
        isAdmin: data.isAdmin,
      },
    });
  }

  async getUserWithDeptById(id: number): Promise<UserWithDept | null> {
    return this.prisma.user.findUnique({ where: { id }, include: { department: true } });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
