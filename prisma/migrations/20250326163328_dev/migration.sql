/*
  Warnings:

  - Added the required column `interventionId` to the `EmployeeInTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EmployeeInTeam` ADD COLUMN `interventionId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `EmployeeInTeam` ADD CONSTRAINT `EmployeeInTeam_interventionId_fkey` FOREIGN KEY (`interventionId`) REFERENCES `Intervention`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
