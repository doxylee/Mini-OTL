import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length } from 'class-validator';

import { CourseWithDept, CourseWithIncludes } from 'src/prisma/repositories/repository.dto';
import { LectureWithProfessorResponseDTO, toLectureWithProfessorResponseDTO } from '../lectures/lectures.dto';

export type CourseResponseDTO = {
  id: number;
  nameKo: string;
  nameEn: string;
  courseCode: string;
  courseNumCode: number;
  lectureTime: number;
  labTime: number;
  credit: number;
  departmentId: number;
  grade: number;
  load: number;
  speech: number;
};

export function courseWithDeptToCourseDTO(course: CourseWithDept): CourseResponseDTO {
  return {
    id: course.id,
    nameKo: course.nameKo,
    nameEn: course.nameEn,
    courseCode: `${course.department.deptCode}${course.courseNumCode}`,
    courseNumCode: course.courseNumCode,
    lectureTime: course.lectureTime,
    labTime: course.labTime,
    credit: course.credit,
    departmentId: course.departmentId,
    grade: course.reviewCount ? course.sumGrade / course.reviewCount : 0,
    load: course.reviewCount ? course.sumLoad / course.reviewCount : 0,
    speech: course.reviewCount ? course.sumSpeech / course.reviewCount : 0,
  };
}

export type CourseWithLecturesResponseDTO = CourseResponseDTO & { lectures: LectureWithProfessorResponseDTO[] };

export function toCourseWithLecturesDTO(course: CourseWithIncludes): CourseWithLecturesResponseDTO {
  return {
    ...courseWithDeptToCourseDTO(course),
    lectures: course.lectures.map(toLectureWithProfessorResponseDTO),
  };
}

export class CourseFindQueryDTO {
  @IsOptional()
  @Transform(({ value }) => value.split(',').map((s) => parseInt(s)))
  @IsInt({ each: true })
  readonly departments?: number[];

  @IsOptional()
  @Transform(({ value }) => value.split(',').map((s) => parseInt(s)))
  @IsInt({ each: true })
  readonly codePrefixes?: number[];

  @IsOptional()
  @IsString()
  @Length(1, 100)
  readonly keyword?: string;
}
