/*
  Warnings:

  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pfp_url` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "google_id" TEXT NOT NULL,
    "pfp_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT
);
INSERT INTO "new_Users" ("google_id", "id", "phone_number") SELECT "google_id", "id", "phone_number" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_google_id_key" ON "Users"("google_id");
CREATE INDEX "phone_number" ON "Users"("phone_number");
PRAGMA foreign_keys=ON;
