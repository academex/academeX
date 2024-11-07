-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
