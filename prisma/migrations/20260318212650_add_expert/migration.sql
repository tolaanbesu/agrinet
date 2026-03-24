/*
  Warnings:

  - Added the required column `expertId` to the `farmer_query` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "farmer_query" ADD COLUMN     "expertId" TEXT NOT NULL;
