/*
  Warnings:

  - You are about to drop the column `libraryId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_libraryId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "libraryId";
