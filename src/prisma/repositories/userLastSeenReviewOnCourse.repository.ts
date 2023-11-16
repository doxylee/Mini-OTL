import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LastSawReviewOnCourse } from './repository.dto';

@Injectable()
export class UserLastSeenReviewOnCourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async sawReviewOnCourse(data: LastSawReviewOnCourse) {
    return await this.prisma.userLastSeenReviewOnCourse.upsert({
      where: { userId_courseId: { userId: data.userId, courseId: data.courseId } },
      update: { lastSeenReviewId: data.lastSeenReviewId },
      create: data,
    });
  }
}
