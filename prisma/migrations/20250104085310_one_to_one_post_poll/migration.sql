/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `poll` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[poll_id]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "poll_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "poll_post_id_key" ON "poll"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_poll_id_key" ON "post"("poll_id");
