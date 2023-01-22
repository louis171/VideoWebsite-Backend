-- CreateTable
CREATE TABLE `UserPaths` (
    `id` VARCHAR(36) NOT NULL,
    `thumb` VARCHAR(200) NULL,
    `poster` VARCHAR(200) NULL,
    `userId` VARCHAR(36) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserPaths_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPaths` ADD CONSTRAINT `UserPaths_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
