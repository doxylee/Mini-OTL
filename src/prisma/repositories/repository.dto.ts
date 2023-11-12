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

export type ReviewCreateInput = {
  userId: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
};

export type ReviewUpdateInput = {
  content: string;
  grade: number;
  load: number;
  speech: number;
};
