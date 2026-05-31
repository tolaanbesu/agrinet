-- AlterTable
ALTER TABLE "farmer_query" ALTER COLUMN "expertId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "farmer_query_expertId_idx" ON "farmer_query"("expertId");

-- AddForeignKey
ALTER TABLE "farmer_query" ADD CONSTRAINT "farmer_query_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
