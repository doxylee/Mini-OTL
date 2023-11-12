import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateReviewBodyDTO {
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

export type CreateReviewDTO = {
  userId: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
};

export type ReviewDTO = {
  id: number;
  userId: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
};

export function toReviewDTO(review: ReviewDTO): ReviewDTO {
  return {
    id: review.id,
    userId: review.userId,
    lectureId: review.lectureId,
    content: review.content,
    grade: review.grade,
    load: review.load,
    speech: review.speech,
  };
}
