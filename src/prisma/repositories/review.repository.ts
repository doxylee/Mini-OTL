import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ReviewCreateInput } from './repository.dto';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkUserReviewExistsForLecture(userId: number, lectureId: number): Promise<boolean> {
    return (
      (await this.prisma.review.findFirst({
        where: { userId, lectureId, isDeleted: false },
      })) !== null
    );
  }

  async createReview(data: ReviewCreateInput): Promise<Review> {
    return await this.prisma.review.create({ data });
  }

  async getReviewsByLectureId(lectureId: number): Promise<Review[]> {
    return await this.prisma.review.findMany({
      where: { lectureId, isDeleted: false },
      include: { _count: { select: { likedUsers: true } } },
    });
  }

  async getReviewsByCourseId(courseId: number): Promise<Review[]> {
    return await this.prisma.review.findMany({
      where: { lecture: { courseId }, isDeleted: false },
      include: { _count: { select: { likedUsers: true } } },
    });
  }
}
