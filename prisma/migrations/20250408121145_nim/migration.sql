-- AlterTable
ALTER TABLE `User` ADD COLUMN `googleAccessToken` VARCHAR(191) NULL,
    ADD COLUMN `googleExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `googleRefreshToken` VARCHAR(191) NULL;
