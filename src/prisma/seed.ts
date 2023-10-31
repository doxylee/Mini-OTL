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

async function main() {
  await Promise.all(
    DEPARTMENTS.map((dept) =>
      prisma.department.upsert({
        where: { deptCode: dept.deptCode },
        update: {},
        create: dept,
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
