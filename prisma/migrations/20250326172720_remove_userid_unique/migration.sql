-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_userId_fkey`;

-- DropIndex
DROP INDEX `Employee_userId_key` ON `Employee`;
