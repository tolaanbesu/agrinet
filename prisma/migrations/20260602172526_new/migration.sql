-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_expertId_fkey";

-- DropForeignKey
ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_performedBy_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_senderId_fkey";

-- DropForeignKey
ALTER TABLE "farmer_query" DROP CONSTRAINT "farmer_query_farmerId_fkey";

-- DropForeignKey
ALTER TABLE "market_alert" DROP CONSTRAINT "market_alert_postedById_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_farmerId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_reportedUserId_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_reporterId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmer_query" ADD CONSTRAINT "farmer_query_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_alert" ADD CONSTRAINT "market_alert_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
