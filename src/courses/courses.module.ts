import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [PrismaModule],
})
export class CoursesModule {}
