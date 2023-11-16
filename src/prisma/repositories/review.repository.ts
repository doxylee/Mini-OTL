import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Review } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ReviewCreateInput, ReviewUpdateInput, ReviewWithLikes } from './repository.dto';

const reviewWithLikeSelect = (userId?: number) => ({
  id: true,
  lectureId: true,
  userId: true,
  content: true,
  grade: true,
  load: true,
  speech: true,
  isDeleted: true,
  likedUsers: userId ? { select: { id: true }, where: { id: userId } } : undefined,
  _count: { select: { likedUsers: true } },
});

function toReviewWithLikes<
  T extends (Review & { likedUsers?: { id: number }[]; _count: { likedUsers: number } }) | null,
>(review: T): T extends null ? ReviewWithLikes | null : ReviewWithLikes {
  if (!review) return null as T extends null ? null : ReviewWithLikes;
  return {
    ...review,
    liked: !!review.likedUsers?.length,
    _count: { likedUsers: review._count?.likedUsers ?? 0 },
  };
}

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
      where: { id, isDeleted: false },
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
    return await this.prisma.review.findUnique({ where: { id, isDeleted: false } });
  }

  async getReviewWithLikesById(id: number, userId?: number): Promise<ReviewWithLikes | null> {
    return toReviewWithLikes(
      await this.prisma.review.findUnique({
        where: { id, isDeleted: false },
        select: reviewWithLikeSelect(userId),
      }),
    );
  }

  async getReviewsWithLikesByLectureId(lectureId: number, userId?: number): Promise<ReviewWithLikes[]> {
    return (
      await this.prisma.review.findMany({
        where: { lectureId, isDeleted: false },
        select: reviewWithLikeSelect(userId),
      })
    ).map(toReviewWithLikes);
  }

  async getReviewsWithLikesByCourseId(courseId: number, userId?: number): Promise<ReviewWithLikes[]> {
    return (
      await this.prisma.review.findMany({
        where: { lecture: { courseId }, isDeleted: false },
        select: reviewWithLikeSelect(userId),
      })
    ).map(toReviewWithLikes);
  }

  async getReviewsWithLikesByUserId(userId: number): Promise<ReviewWithLikes[]> {
    return (
      await this.prisma.review.findMany({
        where: { userId, isDeleted: false },
        select: reviewWithLikeSelect(userId),
      })
    ).map(toReviewWithLikes); // TODO: User can't like their own review so we can just map liked to false, but it's business logic
  }

  // TODO: Better name
  async getReviewsWithLikesLikedByUser(userId: number): Promise<ReviewWithLikes[]> {
    return (
      await this.prisma.review.findMany({
        where: { likedUsers: { some: { id: userId } }, isDeleted: false },
        include: { _count: { select: { likedUsers: true } } },
      })
    ).map((d) => ({ ...d, liked: true }));
  }

  async likeReview(reviewId: number, userId: number): Promise<ReviewWithLikes> {
    return toReviewWithLikes(
      await this.prisma.review.update({
        where: { id: reviewId, isDeleted: false },
        data: { likedUsers: { connect: { id: userId } } },
        select: reviewWithLikeSelect(userId),
      }),
    );
  }

  async unlikeReview(reviewId: number, userId: number): Promise<ReviewWithLikes> {
    return toReviewWithLikes(
      await this.prisma.review.update({
        where: { id: reviewId, isDeleted: false },
        data: { likedUsers: { disconnect: { id: userId } } },
        select: reviewWithLikeSelect(userId),
      }),
    );
  }

  async deleteReview(id: number): Promise<Review> {
    return await this.prisma.review.update({ where: { id, isDeleted: false }, data: { isDeleted: true } });
  }
}
