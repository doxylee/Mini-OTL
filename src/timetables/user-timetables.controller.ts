import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTimetableBodyDTO } from 'src/common/dto/timetables/timetables.dto';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';

@Controller('api/users/:userId/timetables')
export class UserTimetablesController {
  constructor(private readonly timetablesService: TimetablesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTimetable(@JWTUser() user: JWTPayload, @Body() body: CreateTimetableBodyDTO) {
    return this.timetablesService.createTimetableForUser({ userId: user.id, ...body });
  }
}
