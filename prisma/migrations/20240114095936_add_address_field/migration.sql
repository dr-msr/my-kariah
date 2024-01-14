/*
  Warnings:

  - You are about to drop the column `postcode` on the `Site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Site" DROP COLUMN "postcode",
ADD COLUMN     "address" TEXT;
