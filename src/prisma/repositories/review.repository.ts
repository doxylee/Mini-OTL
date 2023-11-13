import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Review } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ReviewCreateInput, ReviewUpdateInput, ReviewWithLikes } from './repository.dto';

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
    // TODO: Generalize prisma error handling
    try {
      return await this.prisma.review.create({ data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // FK constraint error
        if (e.code === 'P2003') {
          // TODO: Reconsider throwing nestjs exceptions in repository layer
          if (e.meta?.field_name === 'lectureId') throw new NotFoundException('Lecture not found');
          if (e.meta?.field_name === 'userId') throw new NotFoundException('User not found');
        }
      }
      throw e;
    }
  }

  async updateReview(id: number, data: ReviewUpdateInput): Promise<Review> {
    return await this.prisma.review.update({
      where: { id },
      // TODO: How to sanitize input? Developers can enter more fields than they should
      data: {
        content: data.content,
        grade: data.grade,
        load: data.load,
        speech: data.speech,
      },
    });
  }

  async getReviewById(id: number): Promise<Review | null> {
    return await this.prisma.review.findUnique({ where: { id } });
  }

  async getReviewWithLikesById(id: number): Promise<ReviewWithLikes | null> {
    return await this.prisma.review.findUnique({
      where: { id },
      include: { _count: { select: { likedUsers: true } } },
    });
  }

  async getReviewsWithLikesByLectureId(lectureId: number): Promise<ReviewWithLikes[]> {
    return await this.prisma.review.findMany({
      where: { lectureId, isDeleted: false },
      include: { _count: { select: { likedUsers: true } } },
    });
  }

  async getReviewsWithLikesByCourseId(courseId: number): Promise<ReviewWithLikes[]> {
    return await this.prisma.review.findMany({
      where: { lecture: { courseId }, isDeleted: false },
      include: { _count: { select: { likedUsers: true } } },
    });
  }
}
