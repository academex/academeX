/*
  Warnings:

  - You are about to drop the column `is_active` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "is_active",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'INACTIVE';
