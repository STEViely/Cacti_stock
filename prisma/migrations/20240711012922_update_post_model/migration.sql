/*
  Warnings:

  - You are about to drop the column `hight` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `item_image` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobile]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `A_side` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `B_side` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `C_side` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `born` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `front_side` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_phone_key` ON `user`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `hight`,
    DROP COLUMN `item_image`,
    ADD COLUMN `A_side` VARCHAR(191) NOT NULL,
    ADD COLUMN `B_side` VARCHAR(191) NOT NULL,
    ADD COLUMN `C_side` VARCHAR(191) NOT NULL,
    ADD COLUMN `born` VARCHAR(191) NOT NULL,
    ADD COLUMN `front_side` VARCHAR(191) NOT NULL,
    ADD COLUMN `height` VARCHAR(191) NULL,
    ADD COLUMN `idcactus` VARCHAR(191) NULL,
    MODIFY `describtion` VARCHAR(191) NULL,
    MODIFY `create_time` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `soldOut_status` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `phone`,
    ADD COLUMN `mobile` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `address_id` VARCHAR(191) NULL,
    MODIFY `isAdmin` BOOLEAN NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `User_mobile_key` ON `user`(`mobile`);
