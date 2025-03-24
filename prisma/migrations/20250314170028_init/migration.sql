/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Employee_email_key` ON `Employee`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Employee_phoneNumber_key` ON `Employee`(`phoneNumber`);
