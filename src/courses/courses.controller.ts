import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
  ReviewDataDTO,
  CreateReviewDTO,
  toReviewDTO,
  ReviewCreateBodyDTO,
  ReviewUpdateBodyDTO,
  UpdateReviewDTO,
  toReviewWithLikesDTO,
} from 'src/common/dto/reviews/reviews.dto';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

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

  @Get('lectures/:lectureId/reviews')
  async getReviewsOnLecture(@Param('lectureId') lectureId: number) {
    return (await this.reviewsService.getReviewsByLectureId(lectureId)).map(toReviewWithLikesDTO);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('lectures/:lectureId/reviews')
  async createReview(
    @Req() req: Request & { user: JWTPayload },
    @Param('lectureId') lectureId: number,
    @Body() review: ReviewCreateBodyDTO,
  ) {
    // TODO: Is it right to use DTO in this way?
    const dto: CreateReviewDTO = { ...review, lectureId, userId: req.user.id };
    return toReviewDTO(await this.reviewsService.createReview(dto));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Patch('lectures/:lectureId/reviews/:id')
  async updateReview(
    @Req() req: Request & { user: JWTPayload },
    @Param('lectureId') lectureId: number,
    @Param('id') id: number,
    @Body() review: ReviewUpdateBodyDTO,
  ) {
    const dto: UpdateReviewDTO = { ...review, id, lectureId, userId: req.user.id };
    return toReviewDTO(await this.reviewsService.updateReviewByUser(dto));
  }

  @Get('lectures/reviews/:reviewId')
  async reviewDetail(@Param('reviewId') reviewId: number) {
    const review = await this.reviewsService.getReviewWithLikesById(reviewId);
    if (!review || review.isDeleted) throw new NotFoundException('Review not found');
    return toReviewWithLikesDTO(review);
  }
}
