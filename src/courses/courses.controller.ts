import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CourseFindQueryDTO,
  courseWithDeptToCourseDTO,
  toCourseWithLecturesDTO,
} from 'src/common/dto/courses/courses.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreateReviewBodyDTO, CreateReviewDTO, toReviewDTO } from 'src/common/dto/reviews/reviews.dto';
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

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('lectures/:lectureId/reviews')
  async createReview(
    @Req() req: Request & { user: JWTPayload },
    @Param('lectureId') lectureId: number,
    @Body() review: CreateReviewBodyDTO,
  ) {
    // TODO: Is it right to use DTO in this way?
    const dto: CreateReviewDTO = { ...review, lectureId, userId: req.user.id };

    return toReviewDTO(await this.reviewsService.createReview(dto));
  }
}
