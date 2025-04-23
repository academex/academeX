/*
  Warnings:

  - A unique constraint covering the columns `[national_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "national_id" TEXT,
ADD COLUMN     "national_id_photo_url" TEXT,
ADD COLUMN     "status_updated_by" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_national_id_key" ON "user"("national_id");
