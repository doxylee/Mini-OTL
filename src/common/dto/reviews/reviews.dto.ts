import { Review } from '@prisma/client';
import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ReviewWithLikes } from 'src/prisma/repositories/repository.dto';

export class ReviewDataDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Min(1)
  @Max(5)
  grade: number;

  @IsInt()
  @Min(1)
  @Max(5)
  load: number;

  @IsInt()
  @Min(1)
  @Max(5)
  speech: number;
}

export class ReviewCreateBodyDTO extends ReviewDataDTO {}
export class ReviewUpdateBodyDTO extends ReviewDataDTO {}

export type CreateReviewDTO = {
  userId: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
};

export type UpdateReviewDTO = {
  id: number;
  userId: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
};

export type ReviewDTO = {
  id: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
  mine: boolean;
};

export const toReviewDTO =
  (currentUserId?: number) =>
  (review: Review): ReviewDTO => ({
    id: review.id,
    lectureId: review.lectureId,
    content: review.content,
    grade: review.grade,
    load: review.load,
    speech: review.speech,
    mine: review.userId === currentUserId,
  });

export type ReviewWithLikesDTO = ReviewDTO & { likes: number };

export const toReviewWithLikesDTO = (currentUserId?: number) => {
  const toReview = toReviewDTO(currentUserId);
  return (review: ReviewWithLikes): ReviewWithLikesDTO => ({
    ...toReview(review),
    likes: review._count.likedUsers,
  });
};
