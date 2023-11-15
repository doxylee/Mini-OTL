import { Injectable } from '@nestjs/common';
import { CreateTimetableDTO } from 'src/common/dto/timetables/timetables.dto';
import { TimetableRepository } from 'src/prisma/repositories/timetable.repository';

@Injectable()
export class TimetablesService {
  constructor(private readonly timetableRepository: TimetableRepository) {}

  async createTimetableForUser(data: CreateTimetableDTO) {
    return this.timetableRepository.create(data);
  }

  async getUserTimetablesWithLectures(userId: number) {
    return this.timetableRepository.getUserTimetablesWithLectures(userId);
  }
}
