-- CreateTable
CREATE TABLE `FileLink` (
    `id` VARCHAR(191) NOT NULL,
    `uri` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FileLink_uri_key`(`uri`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
