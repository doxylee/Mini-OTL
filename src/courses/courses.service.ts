import { Injectable } from '@nestjs/common';
import { CourseFindFilter, CourseRepository } from 'src/prisma/repositories/course.repository';

@Injectable()
export class CoursesService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async getCourseWithLectures(id: number) {
    return await this.courseRepository.getCourseWithLectures(id);
  }

  async findFiltered(filter: CourseFindFilter) {
    return await this.courseRepository.findFiltered(filter);
  }
}
