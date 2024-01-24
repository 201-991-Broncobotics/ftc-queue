/*
  Warnings:

  - Added the required column `toa_id` to the `Competitions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN "phone_number" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Competitions" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "secret" TEXT NOT NULL,
    "toa_id" TEXT NOT NULL
);
INSERT INTO "new_Competitions" ("name", "secret") SELECT "name", "secret" FROM "Competitions";
DROP TABLE "Competitions";
ALTER TABLE "new_Competitions" RENAME TO "Competitions";
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "phone_number" ON "Users"("phone_number");
