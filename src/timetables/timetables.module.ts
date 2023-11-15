import { Module } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { UserTimetablesController } from './user-timetables.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LecturesModule } from 'src/lectures/lectures.module';

@Module({
  providers: [TimetablesService],
  imports: [PrismaModule, LecturesModule],
  controllers: [UserTimetablesController],
})
export class TimetablesModule {}
