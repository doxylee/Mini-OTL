import { ClassTime, Course, Department, Lecture, Professor, Review, Timetable, User } from '@prisma/client';

export type UserCreateDTO = {
  email: string;
  encryptedPassword: string;
  firstName: string;
  lastName: string;
  departmentId: number;
  isAdmin?: boolean;
};

export type UserWithDept = User & { department: Department };

export type CourseWithDept = Course & { department: Department };
export type CourseWithIncludes = CourseWithDept & { lectures: LectureWithProfessorClassTimes[] };

export type LecturewithClassTimes = Lecture & { classTimes: ClassTime[] };

export type LectureWithProfessorClassTimes = Lecture & {
  professor: Professor;
  classTimes: ClassTime[];
};

export type LectureWithCourseProfessorClasstime = Lecture & {
  course: CourseWithDept;
  professor: Professor;
  classTimes: ClassTime[];
};

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

export type ReviewWithLikes = Review & { _count: { likedUsers: number } };

export type ReportCreateInput = {
  userId: number;
  reviewId: number;
  content: string;
};

export type CourseStatUpdateInput = {
  courseId: number;
  gradeChange: number;
  loadChange: number;
  speechChange: number;
  reviewCountChange: number;
};

export type LectureStatUpdateInput = {
  lectureId: number;
  gradeChange: number;
  loadChange: number;
  speechChange: number;
  reviewCountChange: number;
};

export type TimetableCreateInput = {
  userId: number;
  year: number;
  season: number;
};

export type TimetableWithFullLectures = Timetable & { lectures: LectureWithCourseProfessorClasstime[] };

export type TimetableWithLectureTimes = Timetable & { lectures: LecturewithClassTimes[] };
