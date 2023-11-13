import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportCreateDTO } from 'src/common/dto/reviews/report.dto';
import { ReportRepository } from 'src/prisma/repositories/report.repository';
import { ReviewsService } from './reviews.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly reviewsService: ReviewsService,
  ) {}

  async createReport(data: ReportCreateDTO) {
    // TODO: Throw service exceptions instead of HTTP exceptions (for all services)
    const review = await this.reviewsService.getReviewWithId(data.reviewId);
    if (!review) throw new NotFoundException('Review not found');

    return await this.reportRepository.create(data);
  }
}
