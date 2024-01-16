/*
  Warnings:

  - You are about to drop the column `gps_lat` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `gps_lon` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `zonsolat` on the `Site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Site" DROP COLUMN "gps_lat",
DROP COLUMN "gps_lon",
DROP COLUMN "zonsolat",
ADD COLUMN     "placeID" TEXT;
