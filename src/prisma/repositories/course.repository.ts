import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CourseWithDept, CourseWithIncludes } from './repository.dto';

export type CourseFindFilter = {
  departments?: number[];
  codePrefixes?: number[];
  keyword?: string;
};

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCourseWithLectures(id: number): Promise<CourseWithIncludes | null> {
    return await this.prisma.course.findUnique({
      where: { id },
      include: {
        department: true,
        lectures: {
          include: {
            professor: true,
            classTimes: true,
          },
        },
      },
    });
  }

  async findFiltered(filter: CourseFindFilter): Promise<CourseWithDept[]> {
    const courseNumCodeFilter = filter.codePrefixes?.map((prefix) => ({
      courseNumCode: { gte: prefix * 100, lt: (prefix + 1) * 100 },
    }));

    return await this.prisma.course.findMany({
      where: {
        AND: [
          filter.departments ? { departmentId: { in: filter.departments } } : {},
          courseNumCodeFilter ? { OR: courseNumCodeFilter } : {},
          filter.keyword
            ? { OR: [{ nameKo: { contains: filter.keyword } }, { nameEn: { contains: filter.keyword } }] }
            : {},
        ],
      },
      include: { department: true },
    });
  }
}
