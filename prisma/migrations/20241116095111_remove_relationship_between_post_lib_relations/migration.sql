/*
  Warnings:

  - You are about to drop the column `file_id` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_file_id_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "file_id",
ADD COLUMN     "file_url" TEXT,
ADD COLUMN     "libraryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE SET NULL ON UPDATE CASCADE;
