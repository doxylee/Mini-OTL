import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CourseRepository } from './repositories/course.repository';

@Module({
  providers: [PrismaService, UserRepository, CourseRepository],
  exports: [PrismaService, UserRepository, CourseRepository],
})
export class PrismaModule {}
