/*
  Warnings:

  - A unique constraint covering the columns `[deptCode]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Department_deptCode_key` ON `Department`(`deptCode`);
