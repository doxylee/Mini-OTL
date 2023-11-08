import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseFindQueryDTO, courseWithDeptToCourseDTO } from 'src/common/dto/courses/courses.dto';

@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findFiltered(@Query() filter: CourseFindQueryDTO) {
    return (await this.coursesService.findFiltered(filter)).map(courseWithDeptToCourseDTO);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const course = await this.coursesService.findById(id);
    if (!course) throw new NotFoundException('Course not found');
    return courseWithDeptToCourseDTO(course);
  }
}
