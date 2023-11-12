import { ConflictException, Injectable } from '@nestjs/common';
import { CreateReviewDTO } from 'src/common/dto/reviews/reviews.dto';
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
}
