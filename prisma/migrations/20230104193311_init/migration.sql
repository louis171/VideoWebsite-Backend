-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(150) NOT NULL,
    `description` VARCHAR(200) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` VARCHAR(36) NOT NULL,
    `path` VARCHAR(80) NOT NULL,
    `views` VARCHAR(12) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paths` (
    `id` VARCHAR(36) NOT NULL,
    `hd` VARCHAR(200) NOT NULL,
    `thumb` VARCHAR(200) NOT NULL,
    `poster` VARCHAR(200) NOT NULL,
    `videoId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Paths_videoId_key`(`videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tags` (
    `id` VARCHAR(36) NOT NULL,
    `tag1` VARCHAR(20) NOT NULL,
    `tag2` VARCHAR(20) NOT NULL,
    `tag3` VARCHAR(20) NOT NULL,
    `tag4` VARCHAR(20) NOT NULL,
    `tag5` VARCHAR(20) NOT NULL,
    `videoId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Tags_videoId_key`(`videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Heat` (
    `id` VARCHAR(36) NOT NULL,
    `temperature` INTEGER NOT NULL DEFAULT 0,
    `spotlight` BOOLEAN NOT NULL DEFAULT false,
    `videoId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Heat_videoId_key`(`videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Metadata` (
    `id` VARCHAR(36) NOT NULL,
    `width` INTEGER NOT NULL DEFAULT 0,
    `height` INTEGER NOT NULL DEFAULT 0,
    `duration` DECIMAL(5, 3) NOT NULL DEFAULT 0.0,
    `hasAudio` BOOLEAN NOT NULL DEFAULT false,
    `videoId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Metadata_videoId_key`(`videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemTags` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paths` ADD CONSTRAINT `Paths_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tags` ADD CONSTRAINT `Tags_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Heat` ADD CONSTRAINT `Heat_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Metadata` ADD CONSTRAINT `Metadata_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
