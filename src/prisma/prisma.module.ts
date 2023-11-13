import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CourseRepository } from './repositories/course.repository';
import { ReviewRepository } from './repositories/review.repository';
import { ReportRepository } from './repositories/report.repository';

@Module({
  providers: [PrismaService, UserRepository, CourseRepository, ReviewRepository, ReportRepository],
  exports: [PrismaService, UserRepository, CourseRepository, ReviewRepository, ReportRepository],
})
export class PrismaModule {}
