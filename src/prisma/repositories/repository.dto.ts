import { ClassTime, Course, Department, Lecture, Professor } from '@prisma/client';

export type CourseWithDept = Course & { department: Department };
export type CourseWithIncludes = CourseWithDept & { lectures: LectureWithProfessorClassTimes[] };

export type LectureWithProfessorClassTimes = Lecture & { professor: Professor; classTimes: ClassTime[] };
