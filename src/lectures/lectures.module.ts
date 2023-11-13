import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [LecturesService],
  imports: [PrismaModule],
  exports: [LecturesService],
})
export class LecturesModule {}
