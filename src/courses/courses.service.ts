import { Injectable } from '@nestjs/common';
import { CourseFindFilter, CourseRepository } from 'src/prisma/repositories/course.repository';
import { CourseStatUpdateInput } from 'src/prisma/repositories/repository.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async getCourseWithLectures(id: number) {
    return await this.courseRepository.getCourseWithLectures(id);
  }

  async findFiltered(filter: CourseFindFilter) {
    return await this.courseRepository.findFiltered(filter);
  }

  async updateCourseStats(data: CourseStatUpdateInput) {
    return await this.courseRepository.updateCourseStats(data);
  }
}
