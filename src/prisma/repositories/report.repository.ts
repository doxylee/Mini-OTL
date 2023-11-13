import { Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ReportCreateInput } from './repository.dto';

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ReportCreateInput): Promise<Report> {
    return await this.prisma.report.create({
      data: {
        userId: data.userId,
        reviewId: data.reviewId,
        content: data.content,
      },
    });
  }
}
