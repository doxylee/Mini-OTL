import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CourseStatUpdateInput, CourseWithDept, CourseWithIncludes } from './repository.dto';
import { Course } from '@prisma/client';

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

  async getCoursebyId(id: number): Promise<Course | null> {
    return await this.prisma.course.findUnique({ where: { id } });
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

  async updateCourseStats(data: CourseStatUpdateInput) {
    return await this.prisma.course.update({
      where: { id: data.courseId },
      data: {
        sumGrade: { increment: data.gradeChange },
        sumLoad: { increment: data.loadChange },
        sumSpeech: { increment: data.speechChange },
        reviewCount: { increment: data.reviewCountChange },
      },
    });
  }

  async updateLastReviewId(courseId: number) {
    const lastReviewId =
      (
        await this.prisma.review.findFirst({
          where: { lecture: { courseId }, isDeleted: false },
          orderBy: { id: 'desc' },
          select: { id: true },
        })
      )?.id ?? null;
    return await this.prisma.course.update({
      where: { id: courseId },
      data: { lastReviewId: lastReviewId },
    });
  }
}
