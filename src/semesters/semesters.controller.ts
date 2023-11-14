import { Controller, Get } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { toSemesterDTO } from 'src/common/dto/semesters/semesters.dto';

@Controller('api/semesters')
export class SemestersController {
  constructor(private readonly semesterService: SemestersService) {}

  @Get()
  getCurrentSemester() {
    return toSemesterDTO(this.semesterService.getCurrentSemester());
  }
}
