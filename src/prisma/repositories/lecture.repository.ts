import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LectureStatUpdateInput } from './repository.dto';


@Injectable()
export class LectureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getLectureById(id: number) {
    return await this.prisma.lecture.findUnique({ where: { id } });
  }

  async updateLectureStats(data: LectureStatUpdateInput) {
    return await this.prisma.lecture.update({
      where: { id: data.lectureId },
      data: {
        sumGrade: { increment: data.gradeChange },
        sumLoad: { increment: data.loadChange },
        sumSpeech: { increment: data.speechChange },
        reviewCount: { increment: data.reviewCountChange },
      },
    });
  }
}
