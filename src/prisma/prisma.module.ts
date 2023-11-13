import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CourseRepository } from './repositories/course.repository';
import { ReviewRepository } from './repositories/review.repository';
import { ReportRepository } from './repositories/report.repository';
import { LectureRepository } from './repositories/lecture.repository';

@Module({
  providers: [PrismaService, UserRepository, CourseRepository, LectureRepository, ReviewRepository, ReportRepository],
  exports: [PrismaService, UserRepository, CourseRepository, LectureRepository, ReviewRepository, ReportRepository],
})
export class PrismaModule {}
