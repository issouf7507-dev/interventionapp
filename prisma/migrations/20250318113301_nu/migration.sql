/*
  Warnings:

  - You are about to drop the `_EmployeeToIntervention` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_EmployeeToIntervention` DROP FOREIGN KEY `_EmployeeToIntervention_A_fkey`;

-- DropForeignKey
ALTER TABLE `_EmployeeToIntervention` DROP FOREIGN KEY `_EmployeeToIntervention_B_fkey`;

-- DropTable
DROP TABLE `_EmployeeToIntervention`;

-- CreateTable
CREATE TABLE `EmployeeIntervention` (
    `id` VARCHAR(191) NOT NULL,
    `interventionId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EmployeeIntervention_interventionId_employeeId_key`(`interventionId`, `employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeeIntervention` ADD CONSTRAINT `EmployeeIntervention_interventionId_fkey` FOREIGN KEY (`interventionId`) REFERENCES `Intervention`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeIntervention` ADD CONSTRAINT `EmployeeIntervention_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
