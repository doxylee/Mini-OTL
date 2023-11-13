import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReportsService } from './report.service';
import { ReportCreateBodyDTO, toReportDTO } from 'src/common/dto/reviews/report.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { toReviewWithLikesDTO } from 'src/common/dto/reviews/reviews.dto';

@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly reportService: ReportsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':reviewId/likes')
  async likeReview(@Req() req: Request & { user: JWTPayload }, @Param('reviewId') reviewId: number) {
    // TODO: Also return whether the review is liked by user or not (for most APIs)
    return toReviewWithLikesDTO(await this.reviewsService.likeReview(reviewId, req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId/likes')
  async unlikeReview(@Req() req: Request & { user: JWTPayload }, @Param('reviewId') reviewId: number) {
    // TODO: Also return whether the review is liked by user or not (for most APIs)
    return toReviewWithLikesDTO(await this.reviewsService.unlikeReview(reviewId, req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':reviewId/report')
  async createReport(
    @Req() req: Request & { user: JWTPayload },
    @Param('reviewId') reviewId: number,
    @Body() data: ReportCreateBodyDTO,
  ) {
    const report = await this.reportService.createReport({ userId: req.user.id, reviewId, ...data });
    return toReportDTO(report);
  }
}
