import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTimetableBodyDTO, toTimetableWithLecturesDTO } from 'src/common/dto/timetables/timetables.dto';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';

@Controller('api/users/:userId/timetables')
export class UserTimetablesController {
  constructor(private readonly timetablesService: TimetablesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTimetable(@JWTUser() user: JWTPayload, @Body() body: CreateTimetableBodyDTO) {
    return toTimetableWithLecturesDTO({
      ...(await this.timetablesService.createTimetableForUser({ userId: user.id, ...body })),
      lectures: [],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTimetables(@JWTUser() user: JWTPayload, @Param('userId') userId: number) {
    if (user.id !== userId) throw new ForbiddenException('You can only get your own timetables');

    const result = await this.timetablesService.getUserTimetablesWithLectures(user.id);
    return result.map(toTimetableWithLecturesDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':timetableId/lectures/:lectureId')
  async addLectureToTimetable(
    @JWTUser() user: JWTPayload,
    @Param('userId') userId: number,
    @Param('timetableId') timetableId: number,
    @Param('lectureId') lectureId: number,
  ) {
    if (user.id !== userId) throw new ForbiddenException('You can only add lectures to your own timetable');

    const result = await this.timetablesService.addLectureToTimetableForUser(user.id, timetableId, lectureId);
    return toTimetableWithLecturesDTO(result);
  }
}
