import { ConflictException, NotFoundException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReviewDTO, UpdateReviewDTO } from 'src/common/dto/reviews/reviews.dto';
import { ReviewRepository } from 'src/prisma/repositories/review.repository';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(data: CreateReviewDTO) {
    if (await this.reviewRepository.checkUserReviewExistsForLecture(data.userId, data.lectureId))
      throw new ConflictException("User's review already exists for this lecture");

    // TODO: Wrap in transaction
    return this.reviewRepository.createReview(data);
  }

  async updateReviewByUser(data: UpdateReviewDTO) {
    const { id, userId, lectureId, ...rest } = data;
    const review = await this.reviewRepository.getReviewById(id);
    if (!review || review.isDeleted) throw new NotFoundException('Review not found');
    // TODO: Error if lectureId doesn't match?
    if (review.userId !== userId) throw new ForbiddenException('Review can only be updated by its author');

    return this.reviewRepository.updateReview(id, rest);
  }
}