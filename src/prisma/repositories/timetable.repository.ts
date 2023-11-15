import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TimetableCreateInput, TimetableWithLectures } from './repository.dto';

@Injectable()
export class TimetableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TimetableCreateInput) {
    return this.prisma.timetable.create({ data });
  }

  async getUserTimetablesWithLectures(userId: number): Promise<TimetableWithLectures[]> {
    return this.prisma.timetable.findMany({
      where: { userId },
      include: {
        lectures: {
          include: {
            course: { include: { department: true } },
            professor: true,
            classTimes: true,
          },
        },
      },
    });
  }
}
