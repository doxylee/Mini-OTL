import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReportsService } from './report.service';
import { ReportCreateBodyDTO, toReportDTO } from 'src/common/dto/reviews/report.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';

@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly reportService: ReportsService,
  ) {}

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
