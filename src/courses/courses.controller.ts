import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CourseFindQueryDTO,
  courseWithDeptToCourseDTO,
  toCourseWithLecturesDTO,
} from 'src/common/dto/courses/courses.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import {
  CreateReviewDTO,
  toReviewDTO,
  ReviewCreateBodyDTO,
  ReviewUpdateBodyDTO,
  UpdateReviewDTO,
  toReviewWithLikesDTO,
} from 'src/common/dto/reviews/reviews.dto';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';
import { Public } from 'src/auth/decorator/skip-auth.decorator';

@Controller('api/courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  async findFiltered(@Query() filter: CourseFindQueryDTO) {
    return (await this.coursesService.findFiltered(filter)).map(courseWithDeptToCourseDTO);
  }

  @Get(':id')
  async courseDetail(@Param('id') id: number) {
    const course = await this.coursesService.getCourseWithLectures(id);
    if (!course) throw new NotFoundException('Course not found');
    return toCourseWithLecturesDTO(course);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get(':id/reviews')
  async getReviewsOnCourse(@Param('id') id: number, @JWTUser() user?: JWTPayload) {
    return (await this.reviewsService.getReviewsWithLikesByCourseId(id, user?.id)).map(toReviewWithLikesDTO(user?.id));
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get('lectures/:lectureId/reviews')
  async getReviewsOnLecture(@Param('lectureId') lectureId: number, @JWTUser() user?: JWTPayload) {
    return (await this.reviewsService.getReviewsWithLikesByLectureId(lectureId, user?.id)).map(toReviewWithLikesDTO(user?.id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('lectures/:lectureId/reviews')
  async createReview(
    @JWTUser() user: JWTPayload,
    @Param('lectureId') lectureId: number,
    @Body() review: ReviewCreateBodyDTO,
  ) {
    // TODO: Is it right to use DTO in this way?
    const dto: CreateReviewDTO = { ...review, lectureId, userId: user.id };
    return toReviewDTO(user.id)(await this.reviewsService.createReview(dto));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Patch('lectures/:lectureId/reviews/:id')
  async updateReview(
    @JWTUser() user: JWTPayload,
    @Param('lectureId') lectureId: number,
    @Param('id') id: number,
    @Body() review: ReviewUpdateBodyDTO,
  ) {
    const dto: UpdateReviewDTO = { ...review, id, lectureId, userId: user.id };
    return toReviewDTO(user.id)(await this.reviewsService.updateReviewByUser(dto));
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get('lectures/reviews/:reviewId')
  async reviewDetail(@Param('reviewId') reviewId: number, @JWTUser() user?: JWTPayload) {
    const review = await this.reviewsService.getReviewWithLikesById(reviewId, user?.id);
    if (!review || review.isDeleted) throw new NotFoundException('Review not found');
    return toReviewWithLikesDTO(user?.id)(review);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(204)
  @Delete(':id/lectures/:lectureId/reviews/:reviewId')
  async deleteReview(
    @Param('id') id: number,
    @Param('lectureId') lectureId: number,
    @Param('reviewId') reviewId: number,
  ) {
    await this.reviewsService.deleteReviewByAdmin(reviewId);
  }
}
