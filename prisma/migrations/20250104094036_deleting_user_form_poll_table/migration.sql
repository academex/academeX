/*
  Warnings:

  - You are about to drop the column `user_id` on the `poll` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "poll" DROP CONSTRAINT "poll_user_id_fkey";

-- AlterTable
ALTER TABLE "poll" DROP COLUMN "user_id";
