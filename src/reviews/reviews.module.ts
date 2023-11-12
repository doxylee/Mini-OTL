import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ReviewsService],
  imports: [PrismaModule],
  exports: [ReviewsService],
})
export class ReviewsModule {}
