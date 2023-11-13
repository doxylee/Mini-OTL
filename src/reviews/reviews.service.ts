import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateReviewDTO, UpdateReviewDTO } from 'src/common/dto/reviews/reviews.dto';
import { ReviewRepository } from 'src/prisma/repositories/review.repository';
import { ReportsService } from './report.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    @Inject(forwardRef(() => ReportsService))
    private readonly reportService: ReportsService,
  ) {}

  async createReview(data: CreateReviewDTO) {
    if (await this.reviewRepository.checkUserReviewExistsForLecture(data.userId, data.lectureId))
      throw new ConflictException("User's review already exists for this lecture");

    // TODO: Wrap in transaction
    return this.reviewRepository.createReview(data);
  }

  async updateReviewByUser(data: UpdateReviewDTO) {
    const { id, userId, lectureId, ...rest } = data;
    const review = await this.getReviewWithId(id);
    if (review.userId !== userId) throw new ForbiddenException('Review can only be updated by its author');

    return this.reviewRepository.updateReview(id, rest);
  }

  async getReviewWithId(id: number) {
    const review = await this.reviewRepository.getReviewById(id);
    if (!review || review.isDeleted) throw new NotFoundException('Review not found');

    return review;
  }

  async getReviewWithLikesById(id: number) {
    return this.reviewRepository.getReviewWithLikesById(id);
  }

  async getReviewsByLectureId(lectureId: number) {
    return this.reviewRepository.getReviewsWithLikesByLectureId(lectureId);
  }

  async getReviewsByCourseId(courseId: number) {
    return this.reviewRepository.getReviewsWithLikesByCourseId(courseId);
  }

  async likeReview(reviewId: number, userId: number) {
    // Throws error if review doesn't exist
    // TODO: Throw service exceptions instead of HTTP exceptions (for all services)
    await this.getReviewWithId(reviewId);
    return await this.reviewRepository.likeReview(reviewId, userId);
  }

  async unlikeReview(reviewId: number, userId: number) {
    // Throws error if review doesn't exist
    // TODO: Throw service exceptions instead of HTTP exceptions (for all services)
    await this.getReviewWithId(reviewId);
    return await this.reviewRepository.unlikeReview(reviewId, userId);
  }

  async deleteReviewByAdmin(id: number) {
    const review = await this.reviewRepository.getReviewById(id);
    if (!review) throw new NotFoundException('Review not found');
    if (review.isDeleted) throw new ConflictException('Review already deleted');
    if (!(await this.reportService.checkReportExistsForReview(id)))
      throw new ForbiddenException('Review can only be deleted after being reported');

    return await this.reviewRepository.deleteReview(id);
  }
}
