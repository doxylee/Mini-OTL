import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReportsService } from './report.service';
import { ReportCreateBodyDTO, toReportDTO } from 'src/common/dto/reviews/report.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { toReviewWithLikesDTO } from 'src/common/dto/reviews/reviews.dto';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';

@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly reportService: ReportsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':reviewId/likes')
  async likeReview(@JWTUser() user: JWTPayload, @Param('reviewId') reviewId: number) {
    // TODO: Also return whether the review is liked by user or not (for most APIs)
    return toReviewWithLikesDTO(await this.reviewsService.likeReview(reviewId, user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId/likes')
  async unlikeReview(@JWTUser() user: JWTPayload, @Param('reviewId') reviewId: number) {
    // TODO: Also return whether the review is liked by user or not (for most APIs)
    return toReviewWithLikesDTO(await this.reviewsService.unlikeReview(reviewId, user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':reviewId/report')
  async createReport(
    @JWTUser() user: JWTPayload,
    @Param('reviewId') reviewId: number,
    @Body() data: ReportCreateBodyDTO,
  ) {
    const report = await this.reportService.createReport({ userId: user.id, reviewId, ...data });
    return toReportDTO(report);
  }
}
