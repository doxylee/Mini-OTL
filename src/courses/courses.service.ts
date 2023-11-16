import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseFindFilter, CourseRepository } from 'src/prisma/repositories/course.repository';
import { CourseStatUpdateInput } from 'src/prisma/repositories/repository.dto';
import { UserLastSeenReviewOnCourseRepository } from 'src/prisma/repositories/userLastSeenReviewOnCourse.repository';

@Injectable()
export class CoursesService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userLastSeenReviewOnCourseRepository: UserLastSeenReviewOnCourseRepository,
  ) {}

  async getCourseWithLectures(id: number) {
    return await this.courseRepository.getCourseWithLectures(id);
  }

  async findFiltered(filter: CourseFindFilter) {
    return await this.courseRepository.findFiltered(filter);
  }

  async updateCourseStats(data: CourseStatUpdateInput) {
    return await this.courseRepository.updateCourseStats(data);
  }

  async userSawReviewOnCourse(courseId: number, userId: number) {
    const course = await this.courseRepository.getCoursebyId(courseId);
    if (!course) throw new NotFoundException('Course not found');
    if (course.lastReviewId === null) return;
    return await this.userLastSeenReviewOnCourseRepository.sawReviewOnCourse({
      courseId,
      userId,
      lastSeenReviewId: course.lastReviewId,
    });
  }
}
