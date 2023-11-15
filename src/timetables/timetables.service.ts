import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassTime } from '@prisma/client';
import { CreateTimetableDTO } from 'src/common/dto/timetables/timetables.dto';
import { LecturesService } from 'src/lectures/lectures.service';
import { LecturewithClassTimes, TimetableWithLectureTimes } from 'src/prisma/repositories/repository.dto';
import { TimetableRepository } from 'src/prisma/repositories/timetable.repository';

@Injectable()
export class TimetablesService {
  constructor(
    private readonly timetableRepository: TimetableRepository,
    private readonly lecturesService: LecturesService,
  ) {}

  async createTimetableForUser(data: CreateTimetableDTO) {
    return this.timetableRepository.create(data);
  }

  async getUserTimetablesWithLectures(userId: number) {
    return this.timetableRepository.getUserTimetablesWithLectures(userId);
  }

  async getUserTimetableWithLectureById(userId: number, timetableId: number) {
    const result = await this.timetableRepository.getTimetableWithLecturesById(timetableId);
    if (!result || result.userId != userId) throw new NotFoundException('Timetable not found');
    return result;
  }

  async addLectureToTimetableForUser(userId: number, timetableId: number, lectureId: number) {
    const [timetable, lecture] = await Promise.all([
      this.timetableRepository.getTimetableWithLectureTimesById(timetableId),
      await this.lecturesService.getLectureWithClasstimesById(lectureId),
    ]);

    if (!timetable || timetable.userId != userId) throw new NotFoundException('Timetable not found');
    if (lecture.year !== timetable.year || lecture.season !== timetable.season)
      throw new BadRequestException('Can only add lectures on same semester to timetable');
    if (timetable.lectures.some((l) => l.id === lectureId))
      throw new BadRequestException('Lecture already in timetable');
    if (this.checkLectureTimeConflict(lecture, timetable)) throw new BadRequestException('Lecture time conflict');

    return this.timetableRepository.addLectureToTimetable(timetableId, lectureId);
  }

  private checkLectureTimeConflict(lecture: LecturewithClassTimes, timetable: TimetableWithLectureTimes) {
    for (const lectureTime of lecture.classTimes) {
      for (const timetableLecture of timetable.lectures) {
        for (const timetableLectureTime of timetableLecture.classTimes) {
          if (this.checkClasstimeOverlap(lectureTime, timetableLectureTime)) return true;
        }
      }
    }
    return false;
  }

  private checkClasstimeOverlap(a: ClassTime, b: ClassTime) {
    if (a.day !== b.day) return false;
    if (a.startTime < b.endTime && a.endTime > b.startTime) return true;
    return false;
  }

  async removeLectureFromTimetableForUser(userId: number, timetableId: number, lectureId: number) {
    const timetable = await this.timetableRepository.getTimetableWithLectureTimesById(timetableId);
    if (!timetable || timetable.userId != userId) throw new NotFoundException('Timetable not found');
    if (!timetable.lectures.some((l) => l.id === lectureId)) throw new BadRequestException('Lecture not in timetable');

    return this.timetableRepository.removeLectureFromTimetable(timetableId, lectureId);
  }
}
