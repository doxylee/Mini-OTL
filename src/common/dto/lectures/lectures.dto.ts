import { CourseResponseDTO, courseWithDeptToCourseDTO } from '../courses/courses.dto';
import { SimpleProfessorResponseDTO, toSimpleProfessorResponseDTO } from '../professors/professors.dto';
import { ClassTimeResponseDTO, toClassTimeResponseDTO } from './classtime.dto';
import {
  LectureWithCourseProfessorClasstime,
  LectureWithProfessorClassTimes,
} from 'src/prisma/repositories/repository.dto';

export type LectureWithProfessorResponseDTO = {
  id: number;
  courseId: number;
  year: number;
  season: number;
  professor: SimpleProfessorResponseDTO;
  grade: number;
  load: number;
  speech: number;
  classTimes: ClassTimeResponseDTO[];
};

export function toLectureWithProfessorResponseDTO(
  course: LectureWithProfessorClassTimes,
): LectureWithProfessorResponseDTO {
  return {
    id: course.id,
    courseId: course.courseId,
    year: course.year,
    season: course.season,
    professor: toSimpleProfessorResponseDTO(course.professor),
    grade: course.reviewCount ? course.sumGrade / course.reviewCount : 0,
    load: course.reviewCount ? course.sumLoad / course.reviewCount : 0,
    speech: course.reviewCount ? course.sumSpeech / course.reviewCount : 0,
    classTimes: course.classTimes.map(toClassTimeResponseDTO),
  };
}

export type TimetableLectureItemDTO = {
  id: number;
  course: CourseResponseDTO;
  professor: SimpleProfessorResponseDTO;
  grade: number;
  load: number;
  speech: number;
  classTimes: ClassTimeResponseDTO[];
};

export function toTimetableLectureItemDTO(lecture: LectureWithCourseProfessorClasstime): TimetableLectureItemDTO {
  return {
    id: lecture.id,
    course: courseWithDeptToCourseDTO(lecture.course),
    professor: toSimpleProfessorResponseDTO(lecture.professor),
    grade: lecture.reviewCount ? lecture.sumGrade / lecture.reviewCount : 0,
    load: lecture.reviewCount ? lecture.sumLoad / lecture.reviewCount : 0,
    speech: lecture.reviewCount ? lecture.sumSpeech / lecture.reviewCount : 0,
    classTimes: lecture.classTimes.map(toClassTimeResponseDTO),
  };
}
