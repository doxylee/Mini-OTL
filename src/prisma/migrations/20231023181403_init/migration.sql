-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameKo` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `deptCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Professor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameKo` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `courseNumCode` INTEGER NOT NULL,
    `lectureTime` INTEGER NOT NULL,
    `labTime` INTEGER NOT NULL,
    `credit` INTEGER NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `sumGrade` INTEGER NOT NULL DEFAULT 0,
    `sumLoad` INTEGER NOT NULL DEFAULT 0,
    `sumSpeech` INTEGER NOT NULL DEFAULT 0,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lecture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `season` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,
    `sumGrade` INTEGER NOT NULL DEFAULT 0,
    `sumLoad` INTEGER NOT NULL DEFAULT 0,
    `sumSpeech` INTEGER NOT NULL DEFAULT 0,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lectureId` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,
    `startTime` TIME NOT NULL,
    `endTime` TIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Semester` (
    `year` INTEGER NOT NULL,
    `season` INTEGER NOT NULL,

    PRIMARY KEY (`year`, `season`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `lectureId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `grade` INTEGER NOT NULL,
    `load` INTEGER NOT NULL,
    `speech` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reviewId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Timetable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `season` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DepartmentToProfessor` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DepartmentToProfessor_AB_unique`(`A`, `B`),
    INDEX `_DepartmentToProfessor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LectureToTimetable` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LectureToTimetable_AB_unique`(`A`, `B`),
    INDEX `_LectureToTimetable_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LikedReviews` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LikedReviews_AB_unique`(`A`, `B`),
    INDEX `_LikedReviews_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecture` ADD CONSTRAINT `Lecture_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecture` ADD CONSTRAINT `Lecture_year_season_fkey` FOREIGN KEY (`year`, `season`) REFERENCES `Semester`(`year`, `season`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecture` ADD CONSTRAINT `Lecture_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassTime` ADD CONSTRAINT `ClassTime_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timetable` ADD CONSTRAINT `Timetable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timetable` ADD CONSTRAINT `Timetable_year_season_fkey` FOREIGN KEY (`year`, `season`) REFERENCES `Semester`(`year`, `season`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DepartmentToProfessor` ADD CONSTRAINT `_DepartmentToProfessor_A_fkey` FOREIGN KEY (`A`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DepartmentToProfessor` ADD CONSTRAINT `_DepartmentToProfessor_B_fkey` FOREIGN KEY (`B`) REFERENCES `Professor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LectureToTimetable` ADD CONSTRAINT `_LectureToTimetable_A_fkey` FOREIGN KEY (`A`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LectureToTimetable` ADD CONSTRAINT `_LectureToTimetable_B_fkey` FOREIGN KEY (`B`) REFERENCES `Timetable`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LikedReviews` ADD CONSTRAINT `_LikedReviews_A_fkey` FOREIGN KEY (`A`) REFERENCES `Review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LikedReviews` ADD CONSTRAINT `_LikedReviews_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
