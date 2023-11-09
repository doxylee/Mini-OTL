import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseFindQueryDTO, courseWithDeptToCourseDTO, toCourseWithLecturesDTO } from 'src/common/dto/courses/courses.dto';

@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findFiltered(@Query() filter: CourseFindQueryDTO) {
    return (await this.coursesService.findFiltered(filter)).map(courseWithDeptToCourseDTO);
  }

  @Get(':id')
  async courseDetail(@Param('id') id: number) {
    const course = await this.coursesService.getCourseWithLectures(id);
    if (!course) throw new NotFoundException('Course not found');
    return toCourseWithLecturesDTO(course);
  }
}
