/*
  Warnings:

  - You are about to alter the column `views` on the `video` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `video` MODIFY `views` INTEGER NOT NULL DEFAULT 0;
