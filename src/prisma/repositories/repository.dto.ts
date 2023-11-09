import { ClassTime, Course, Department, Lecture, Professor } from '@prisma/client';

export type UserCreateDTO = {
  email: string;
  encryptedPassword: string;
  firstName: string;
  lastName: string;
  departmentId: number;
  isAdmin?: boolean;
};

export type CourseWithDept = Course & { department: Department };
export type CourseWithIncludes = CourseWithDept & { lectures: LectureWithProfessorClassTimes[] };

export type LectureWithProfessorClassTimes = Lecture & { professor: Professor; classTimes: ClassTime[] };
