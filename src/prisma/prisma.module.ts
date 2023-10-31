import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository],
})
export class PrismaModule {}
