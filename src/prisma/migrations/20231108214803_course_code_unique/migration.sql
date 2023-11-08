/*
  Warnings:

  - A unique constraint covering the columns `[departmentId,courseNumCode]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Course_departmentId_courseNumCode_key` ON `Course`(`departmentId`, `courseNumCode`);
