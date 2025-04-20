/*
  Warnings:

  - Added the required column `subject` to the `library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year_num` to the `library` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LibraryType" AS ENUM ('EXAM', 'SUMMARY', 'CHAPTER', 'BOOK');

-- AlterTable
ALTER TABLE "library" ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "type" "LibraryType" NOT NULL DEFAULT 'SUMMARY',
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "year_num" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "star" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "library_id" INTEGER NOT NULL,

    CONSTRAINT "star_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LibraryToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "star_library_id_idx" ON "star"("library_id");

-- CreateIndex
CREATE UNIQUE INDEX "star_user_id_library_id_key" ON "star"("user_id", "library_id");

-- CreateIndex
CREATE UNIQUE INDEX "_LibraryToTag_AB_unique" ON "_LibraryToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_LibraryToTag_B_index" ON "_LibraryToTag"("B");

-- CreateIndex
CREATE INDEX "library_user_id_idx" ON "library"("user_id");

-- AddForeignKey
ALTER TABLE "library" ADD CONSTRAINT "library_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star" ADD CONSTRAINT "star_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star" ADD CONSTRAINT "star_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LibraryToTag" ADD CONSTRAINT "_LibraryToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LibraryToTag" ADD CONSTRAINT "_LibraryToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
