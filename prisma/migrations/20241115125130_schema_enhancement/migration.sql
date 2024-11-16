/*
  Warnings:

  - The values [TEST] on the enum `ReactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `likes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Post_Uploads` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordTokenExpires` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reset_password_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_name` to the `Library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_size` to the `Library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `Library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_name` to the `Post_Uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_size` to the `Post_Uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Post_Uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `Post_Uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReactionType_new" AS ENUM ('HEART', 'CLAPPING', 'FUNNY', 'CELEBRATE', 'QUESTION', 'INSIGHTFUL', 'LIKE');
ALTER TABLE "Reaction" ALTER COLUMN "type" TYPE "ReactionType_new" USING ("type"::text::"ReactionType_new");
ALTER TYPE "ReactionType" RENAME TO "ReactionType_old";
ALTER TYPE "ReactionType_new" RENAME TO "ReactionType";
DROP TYPE "ReactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Library" ADD COLUMN     "file_name" TEXT NOT NULL,
ADD COLUMN     "file_size" INTEGER NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mime_type" TEXT NOT NULL,
ALTER COLUMN "stars" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likes",
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Post_Uploads" DROP COLUMN "url",
ADD COLUMN     "file_name" TEXT NOT NULL,
ADD COLUMN     "file_size" INTEGER NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "mime_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswordToken",
DROP COLUMN "resetPasswordTokenExpires",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reset_password_token" TEXT,
ADD COLUMN     "reset_password_token_expires" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Post_user_id_idx" ON "Post"("user_id");

-- CreateIndex
CREATE INDEX "Post_Uploads_post_id_idx" ON "Post_Uploads"("post_id");

-- CreateIndex
CREATE INDEX "Reaction_postId_idx" ON "Reaction"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_reset_password_token_key" ON "User"("reset_password_token");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
