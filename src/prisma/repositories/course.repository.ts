import { Injectable } from '@nestjs/common';
import { Course, Department, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export type CourseFindFilter = {
  departments?: number[];
  codePrefixes?: number[];
  keyword?: string;
};

export type CourseWithDept = Course & { department: Department };

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<CourseWithDept | null> {
    return await this.prisma.course.findUnique({ where: { id }, include: { department: true } });
  }

  async findFiltered(filter: CourseFindFilter): Promise<CourseWithDept[]> {
    console.log(filter);
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
