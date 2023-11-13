import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewsController } from './reviews.controller';
import { ReportsService } from './report.service';

@Module({
  providers: [ReviewsService, ReportsService],
  imports: [PrismaModule],
  exports: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
