import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TimetableCreateInput, TimetableWithFullLectures, TimetableWithLectureTimes } from './repository.dto';

const TIMETABLE_WITH_FULL_LECTURES_INCLUDE = {
  lectures: {
    include: {
      course: { include: { department: true } },
      professor: true,
      classTimes: true,
    },
  },
} as const;

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

  async getTimetableWithLecturesById(id: number): Promise<TimetableWithFullLectures | null> {
    return this.prisma.timetable.findUnique({
      where: { id },
      include: TIMETABLE_WITH_FULL_LECTURES_INCLUDE,
    });
  }

  async getUserTimetablesWithLectures(userId: number): Promise<TimetableWithFullLectures[]> {
    return this.prisma.timetable.findMany({
      where: { userId },
      include: TIMETABLE_WITH_FULL_LECTURES_INCLUDE,
    });
  }

  async addLectureToTimetable(timetableId: number, lectureId: number): Promise<TimetableWithFullLectures> {
    return this.prisma.timetable.update({
      where: { id: timetableId },
      data: { lectures: { connect: { id: lectureId } } },
      include: TIMETABLE_WITH_FULL_LECTURES_INCLUDE,
    });
  }

  async removeLectureFromTimetable(timetableId: number, lectureId: number): Promise<TimetableWithFullLectures> {
    return this.prisma.timetable.update({
      where: { id: timetableId },
      data: { lectures: { disconnect: { id: lectureId } } },
      include: TIMETABLE_WITH_FULL_LECTURES_INCLUDE,
    });
  }
}
