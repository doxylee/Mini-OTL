import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Injectable,
  Inject,
  forwardRef,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReviewDTO, UpdateReviewDTO } from 'src/common/dto/reviews/reviews.dto';
import { ReviewRepository } from 'src/prisma/repositories/review.repository';
import { ReportsService } from './report.service';
import { CoursesService } from 'src/courses/courses.service';
import { LecturesService } from 'src/lectures/lectures.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    @Inject(forwardRef(() => ReportsService))
    private readonly reportService: ReportsService,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
    private readonly lecturesService: LecturesService,
  ) {}

  async createReview(data: CreateReviewDTO) {
    // TODO: Wrap in transaction
    if (await this.reviewRepository.checkUserReviewExistsForLecture(data.userId, data.lectureId))
      throw new ConflictException("User's review already exists for this lecture");

    const lecture = await this.lecturesService.getLectureWithClasstimesById(data.lectureId);

    const newReview = await this.reviewRepository.createReview(data);
    try {
      const changes = {
        gradeChange: data.grade,
        loadChange: data.load,
        speechChange: data.speech,
        reviewCountChange: 1,
      };
      await Promise.all([
        this.coursesService.updateCourseStats({ ...changes, courseId: lecture.courseId }),
        this.lecturesService.updateLectureStats({ ...changes, lectureId: data.lectureId }),
      ]);
    } catch (e) {
      // TODO: Handle better
      console.error(e);
      throw new InternalServerErrorException(e);
    }
    return newReview;
  }

  async updateReviewByUser(data: UpdateReviewDTO) {
    const { id, userId, lectureId, ...rest } = data;
    const review = await this.getReviewWithId(id);
    if (review.userId !== userId) throw new ForbiddenException('Review can only be updated by its author');

    const lecture = await this.lecturesService.getLectureWithClasstimesById(data.lectureId);

    const newReview = await this.reviewRepository.updateReview(id, rest);
    try {
      const changes = {
        gradeChange: data.grade - review.grade,
        loadChange: data.load - review.load,
        speechChange: data.speech - review.speech,
        reviewCountChange: 0,
      };
      if (changes.gradeChange || changes.loadChange || changes.speechChange) {
        await Promise.all([
          this.coursesService.updateCourseStats({ ...changes, courseId: lecture.courseId }),
          this.lecturesService.updateLectureStats({ ...changes, lectureId: review.lectureId }),
        ]);
      }
    } catch (e) {
      // TODO: Handle better
      console.error(e);
      throw new InternalServerErrorException(e);
    }
    return newReview;
  }

  async getReviewWithId(id: number) {
    const review = await this.reviewRepository.getReviewById(id);
    if (!review || review.isDeleted) throw new NotFoundException('Review not found');

    return review;
  }

  async getReviewWithLikesById(id: number, userid: number|undefined) {
    return this.reviewRepository.getReviewWithLikesById(id, userid);
  }

  async getReviewsWithLikesByLectureId(lectureId: number, userId: number | undefined) {
    return this.reviewRepository.getReviewsWithLikesByLectureId(lectureId, userId);
  }

  async getReviewsWithLikesByCourseId(courseId: number, userId: number | undefined) {
    return this.reviewRepository.getReviewsWithLikesByCourseId(courseId, userId);
  }

  async likeReview(reviewId: number, userId: number) {
    // Throws error if review doesn't exist
    // TODO: Throw service exceptions instead of HTTP exceptions (for all services)
    const review = await this.getReviewWithId(reviewId);
    if (review.userId === userId) throw new ForbiddenException('User cannot like own review');

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
    const lecture = await this.lecturesService.getLectureWithClasstimesById(review.lectureId);

    const deletedReview = await this.reviewRepository.deleteReview(id);

    try {
      const changes = {
        gradeChange: -review.grade,
        loadChange: -review.load,
        speechChange: -review.speech,
        reviewCountChange: -1,
      };
      if (changes.gradeChange || changes.loadChange || changes.speechChange) {
        await Promise.all([
          this.coursesService.updateCourseStats({ ...changes, courseId: lecture.courseId }),
          this.lecturesService.updateLectureStats({ ...changes, lectureId: review.lectureId }),
        ]);
      }
    } catch (e) {
      // TODO: Handle better
      console.error(e);
      throw new InternalServerErrorException(e);
    }
    return deletedReview;
  }

  async getReviewsOfUser(userId: number) {
    return this.reviewRepository.getReviewsWithLikesByUserId(userId);
  }

  async getReviewsLikedByUser(userId: number) {
    return this.reviewRepository.getReviewsWithLikesLikedByUser(userId);
  }
}
