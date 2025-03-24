/*
  Warnings:

  - You are about to drop the column `interventionId` on the `EmployeeInTeam` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `EmployeeInTeam` DROP FOREIGN KEY `EmployeeInTeam_interventionId_fkey`;

-- DropIndex
DROP INDEX `EmployeeInTeam_interventionId_fkey` ON `EmployeeInTeam`;

-- AlterTable
ALTER TABLE `EmployeeInTeam` DROP COLUMN `interventionId`;
