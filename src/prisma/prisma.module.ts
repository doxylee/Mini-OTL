import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CourseRepository } from './repositories/course.repository';
import { ReviewRepository } from './repositories/review.repository';

@Module({
  providers: [PrismaService, UserRepository, CourseRepository, ReviewRepository],
  exports: [PrismaService, UserRepository, CourseRepository, ReviewRepository],
})
export class PrismaModule {}
