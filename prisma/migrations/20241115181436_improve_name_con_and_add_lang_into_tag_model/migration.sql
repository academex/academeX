/*
  Warnings:

  - You are about to drop the column `college` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `college_ar` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `college_en` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `major_ar` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `major_en` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "college",
DROP COLUMN "major",
ADD COLUMN     "college_ar" TEXT NOT NULL,
ADD COLUMN     "college_en" TEXT NOT NULL,
ADD COLUMN     "major_ar" TEXT NOT NULL,
ADD COLUMN     "major_en" TEXT NOT NULL;
