import { Module } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { UserTimetablesController } from './user-timetables.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [TimetablesService],
  imports: [PrismaModule],
  controllers: [UserTimetablesController],
})
export class TimetablesModule {}
