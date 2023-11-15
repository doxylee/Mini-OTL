import { Injectable, NotFoundException } from '@nestjs/common';
import { LectureRepository } from 'src/prisma/repositories/lecture.repository';
import { LectureStatUpdateInput } from 'src/prisma/repositories/repository.dto';

@Injectable()
export class LecturesService {
  constructor(private readonly lecturesRepository: LectureRepository) {}

  async getLectureWithClasstimesById(id: number) {
    const lecture = await this.lecturesRepository.getLectureWithClasstimesById(id);
    // TODO: Throw service exceptions instead of HTTP exceptions (for all services)
    if (!lecture) throw new NotFoundException('Lecture not found');
    return lecture;
  }

  async updateLectureStats(data: LectureStatUpdateInput) {
    return await this.lecturesRepository.updateLectureStats(data);
  }
}
