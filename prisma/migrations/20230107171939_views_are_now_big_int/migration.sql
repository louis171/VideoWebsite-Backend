/*
  Warnings:

  - You are about to alter the column `views` on the `video` table. The data in that column could be lost. The data in that column will be cast from `VarChar(12)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `video` MODIFY `views` BIGINT NOT NULL DEFAULT 0;
