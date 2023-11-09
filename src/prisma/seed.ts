import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const DEPARTMENTS: Prisma.DepartmentCreateInput[] = [
  { deptCode: 'ME', nameKo: '기계공학과', nameEn: 'Mechanical Engineering' },
  { deptCode: 'EE', nameKo: '전기및전자공학부', nameEn: 'Electrical Engineering' },
  { deptCode: 'BTM', nameKo: '기술경영학부', nameEn: 'Business and Technology Management' },
  { deptCode: 'ID', nameKo: '산업디자인학과', nameEn: 'Industrial Design' },
  { deptCode: 'IE', nameKo: '산업및시스템공학과', nameEn: 'Industrial and Systems Engineering' },
  { deptCode: 'TS', nameKo: '융합인재학부', nameEn: 'Transdisciplinary Studies' },
  { deptCode: 'CS', nameKo: '전산학부', nameEn: 'Computer Science' },
];

const COURSES = [
  {
    deptCode: 'ID',
    nameKo: 'PM의 역할과 이해',
    nameEn: 'Understanding and Role of PM',
    courseNumCode: 203,
  },
  {
    deptCode: 'TS',
    nameKo: '융합형 인재 개론',
    nameEn: 'Introduction to Transdisciplinary Studies',
    courseNumCode: 200,
  },
  {
    deptCode: 'CS',
    nameKo: 'OTL에서 기술 리더로 살아남는 법',
    nameEn: 'How to Survive as a Tech Leader in OTL',
    courseNumCode: 330,
  },
  {
    deptCode: 'BTM',
    nameKo: '알차게 휴학하는 방법',
    nameEn: 'How to Take a Leave of Absence',
    courseNumCode: 442,
  },
  {
    deptCode: 'EE',
    nameKo: '대학원 진학과 군문제 해결',
    nameEn: 'Graduate School and Military Service',
    courseNumCode: 327,
  },
  {
    deptCode: 'EE',
    nameKo: '즐거운 대학원 생활',
    nameEn: 'Enjoyable Graduate School Life',
    courseNumCode: 444,
  },
  {
    deptCode: 'EE',
    nameKo: '슬기로운 대학원 생활',
    nameEn: 'Wise Graduate School Life',
    courseNumCode: 445,
  },
  {
    deptCode: 'EE',
    nameKo: '편하게 군대 다녀오기',
    nameEn: 'How to Easily Serve in the Military',
    courseNumCode: 210,
  },
  {
    deptCode: 'ID',
    nameKo: '스팍스에서 디자이너로 살아남기',
    nameEn: 'How to Survive as a Designer in SPARCS',
    courseNumCode: 312,
  },
  {
    deptCode: 'ID',
    nameKo: '피그마 개론 1',
    nameEn: 'Introduction to Figma 1',
    courseNumCode: 320,
  },
  {
    deptCode: 'ID',
    nameKo: '피그마 개론 심화 2',
    nameEn: 'Advanced Introduction to Figma 2',
    courseNumCode: 330,
  },
  {
    deptCode: 'BTM',
    nameKo: '우당탕탕 자취개론',
    nameEn: 'Introduction to Living Alone',
    courseNumCode: 201,
  },
  {
    deptCode: 'CS',
    nameKo: '자바스크립트 개론',
    nameEn: 'Introduction to JavaScript',
    courseNumCode: 200,
  },
  {
    deptCode: 'CS',
    nameKo: '타입스크립트 개론',
    nameEn: 'Introduction to TypeScript',
    courseNumCode: 300,
  },
];

const COURSE_ADDITIONAL_FIELDS = {
  lectureTime: 3,
  labTime: 0,
  credit: 3,
};

const PROFESSORS = [
  { name: 'larry', departments: ['EE', 'BTM'] },
  { name: 'platypus', departments: ['CS', 'ID'] },
  { name: 'tom', departments: ['TS', 'CS'] },
  { name: 'yumyum', departments: ['CS', 'ID'] },
  { name: 'duncan', departments: ['CS', 'EE'] },
  { name: 'april', departments: ['IE', 'CS'] },
];

const SEMESTERS = [
  { year: 2023, season: 1 },
  { year: 2023, season: 3 },
];

const LECTURES = [
  {
    courseId: 1,
    professorName: 'yumyum',
    seasons: [1, 3],
    year: 2023,
    classTimes: [
      { day: 1, start: 10.5, end: 12 },
      { day: 3, start: 10.5, end: 12 },
    ],
  },
  {
    courseId: 2,
    professorName: 'tom',
    seasons: [1, 3],
    year: 2023,
    classTimes: [
      { day: 2, start: 13, end: 14.5 },
      { day: 4, start: 13, end: 14.5 },
    ],
  },
  {
    courseId: 3,
    professorName: 'platypus',
    seasons: [1, 3],
    year: 2023,
    classTimes: [
      { day: 1, start: 10.5, end: 12 },
      { day: 3, start: 10.5, end: 12 },
    ],
  },
  {
    courseId: 4,
    professorName: 'larry',
    seasons: [1, 3],
    year: 2023,
    classTimes: [
      { day: 2, start: 13, end: 14.5 },
      { day: 4, start: 13, end: 14.5 },
    ],
  },
  {
    courseId: 5,
    professorName: 'duncan',
    seasons: [1, 3],
    year: 2023,
    classTimes: [
      { day: 2, start: 10.5, end: 12 },
      { day: 4, start: 10.5, end: 12 },
    ],
  },
  {
    courseId: 6,
    professorName: 'larry',
    seasons: [1, 3],
    year: 2023,
    classTimes: [
      { day: 2, start: 10.5, end: 12 },
      { day: 4, start: 10.5, end: 12 },
    ],
  },
  {
    courseId: 7,
    professorName: 'yumyum',
    seasons: [1, 3],
    year: 2023,
    classTimes: [
      { day: 1, start: 14.5, end: 16 },
      { day: 3, start: 14.5, end: 16 },
    ],
  },
  {
    courseId: 8,
    professorName: 'april',
    seasons: [3],
    year: 2023,
    classTimes: [
      { day: 1, start: 14.5, end: 16 },
      { day: 3, start: 14.5, end: 16 },
    ],
  },
  {
    courseId: 9,
    professorName: 'platypus',
    seasons: [3],
    year: 2023,
    classTimes: [
      { day: 2, start: 14.5, end: 16 },
      { day: 4, start: 14.5, end: 16 },
    ],
  },
  {
    courseId: 10,
    professorName: 'april',
    seasons: [1],
    year: 2023,
    classTimes: [
      { day: 2, start: 14.5, end: 16 },
      { day: 4, start: 14.5, end: 16 },
    ],
  },
  {
    courseId: 11,
    professorName: 'yumyum',
    seasons: [1],
    year: 2023,
    classTimes: [
      { day: 1, start: 13, end: 14.5 },
      { day: 3, start: 13, end: 14.5 },
    ],
  },
  {
    courseId: 12,
    professorName: 'yumyum',
    seasons: [3],
    year: 2023,
    classTimes: [
      { day: 1, start: 13, end: 14.5 },
      { day: 3, start: 13, end: 14.5 },
    ],
  },
  {
    courseId: 13,
    professorName: 'duncan',
    seasons: [1],
    year: 2023,
    classTimes: [{ day: 5, start: 13, end: 16 }],
  },
  {
    courseId: 14,
    professorName: 'duncan',
    seasons: [3],
    year: 2023,
    classTimes: [{ day: 5, start: 13, end: 16 }],
  },
];

async function main() {
  const departments = await Promise.all(
    DEPARTMENTS.map((dept) =>
      prisma.department.upsert({
        where: { deptCode: dept.deptCode },
        update: {},
        create: dept,
      }),
    ),
  );

  const courses = await Promise.all(
    COURSES.map((course, idx) =>
      prisma.course.upsert({
        // prisma only supports where with unique fields
        where: {
          id: idx + 1,
        },
        update: {},
        create: {
          id: idx + 1,
          nameKo: course.nameKo,
          nameEn: course.nameEn,
          courseNumCode: course.courseNumCode,
          ...COURSE_ADDITIONAL_FIELDS,
          departmentId: departments.find((dept) => dept.deptCode === course.deptCode)!.id,
        },
      }),
    ),
  );

  const semesters = await Promise.all(
    SEMESTERS.map((semester) =>
      prisma.semester.upsert({
        where: { year_season: { year: semester.year, season: semester.season } },
        update: {},
        create: semester,
      }),
    ),
  );

  const professors = await Promise.all(
    PROFESSORS.map((professor, idx) =>
      prisma.professor.upsert({
        where: { id: idx + 1 },
        update: {},
        create: {
          id: idx + 1,
          name: professor.name,
          departments: {
            connect: professor.departments.map((deptCode) => ({ deptCode })),
          },
        },
      }),
    ),
  );

  const lectures = await Promise.all(
    LECTURES.flatMap(({ seasons, ...lecture }) => seasons.map((season) => ({ season, ...lecture }))).map(
      (lecture, idx) =>
        prisma.lecture.upsert({
          where: { id: idx + 1 },
          update: {},
          create: {
            id: idx + 1,
            courseId: lecture.courseId,
            year: lecture.year,
            season: lecture.season,
            professorId: professors.find((professor) => professor.name === lecture.professorName)!.id,
            classTimes: {
              create: lecture.classTimes.map((classTime) => ({
                day: classTime.day,
                // Need to set year later than epoch or about 2 minute is added for some reason.
                startTime: new Date(2000, 0, 1, classTime.start),
                endTime: new Date(2000, 0, 1, classTime.end),
              })),
            },
          },
        }),
    ),
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
