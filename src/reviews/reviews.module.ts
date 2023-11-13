import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewsController } from './reviews.controller';
import { ReportsService } from './report.service';
import { CoursesModule } from 'src/courses/courses.module';
import { LecturesModule } from 'src/lectures/lectures.module';

@Module({
  providers: [ReviewsService, ReportsService],
  imports: [PrismaModule, forwardRef(() => CoursesModule), LecturesModule],
  exports: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
