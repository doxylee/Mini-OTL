import { Module, forwardRef } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [PrismaModule, forwardRef(() => ReviewsModule)],
  exports: [CoursesService],
})
export class CoursesModule {}
