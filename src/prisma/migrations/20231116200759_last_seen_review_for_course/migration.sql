-- AlterTable
ALTER TABLE `Course` ADD COLUMN `lastReviewId` INTEGER NULL;

-- CreateTable
CREATE TABLE `UserLastSeenReviewOnCourse` (
    `userId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `lastSeenReviewId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserLastSeenReviewOnCourse` ADD CONSTRAINT `UserLastSeenReviewOnCourse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `UserLastSeenReviewOnCourse` ADD CONSTRAINT `UserLastSeenReviewOnCourse_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
