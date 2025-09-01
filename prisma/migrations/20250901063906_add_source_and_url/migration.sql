/*
  Warnings:

  - Made the column `source` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "url" TEXT,
ALTER COLUMN "source" SET NOT NULL;
