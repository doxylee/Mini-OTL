import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TimetableCreateInput, TimetableWithFullLectures, TimetableWithLectureTimes } from './repository.dto';

@Injectable()
export class TimetableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TimetableCreateInput) {
    return this.prisma.timetable.create({ data });
  }

  async getTimetableWithLectureTimesById(id: number): Promise<TimetableWithLectureTimes | null> {
    return this.prisma.timetable.findUnique({
      where: { id },
      include: { lectures: { include: { classTimes: true } } },
    });
  }

  async getUserTimetablesWithLectures(userId: number): Promise<TimetableWithFullLectures[]> {
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

  async addLectureToTimetable(timetableId: number, lectureId: number): Promise<TimetableWithFullLectures> {
    return this.prisma.timetable.update({
      where: { id: timetableId },
      data: { lectures: { connect: { id: lectureId } } },
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
