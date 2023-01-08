/*
  Warnings:

  - Added the required column `updated` to the `Heat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Metadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Paths` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `SystemTags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `heat` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `metadata` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `paths` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `systemtags` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tags` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;
