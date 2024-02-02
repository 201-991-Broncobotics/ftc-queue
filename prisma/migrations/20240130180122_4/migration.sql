/*
  Warnings:

  - The primary key for the `Competitions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `competition_name` on the `Matches` table. All the data in the column will be lost.
  - Added the required column `id` to the `Competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competition_id` to the `Matches` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__CompetitionsToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CompetitionsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Competitions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompetitionsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CompetitionsToUsers" ("A", "B") SELECT "A", "B" FROM "_CompetitionsToUsers";
DROP TABLE "_CompetitionsToUsers";
ALTER TABLE "new__CompetitionsToUsers" RENAME TO "_CompetitionsToUsers";
CREATE UNIQUE INDEX "_CompetitionsToUsers_AB_unique" ON "_CompetitionsToUsers"("A", "B");
CREATE INDEX "_CompetitionsToUsers_B_index" ON "_CompetitionsToUsers"("B");
CREATE TABLE "new_Competitions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "secret" TEXT NOT NULL,
    "toa_id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Competitions" ("name", "secret", "toa_id") SELECT "name", "secret", "toa_id" FROM "Competitions";
DROP TABLE "Competitions";
ALTER TABLE "new_Competitions" RENAME TO "Competitions";
CREATE TABLE "new_Matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_queuing" BOOLEAN NOT NULL,
    "is_done" BOOLEAN NOT NULL,
    "competition_id" TEXT NOT NULL,
    CONSTRAINT "Matches_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competitions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Matches" ("id", "is_done", "is_queuing") SELECT "id", "is_done", "is_queuing" FROM "Matches";
DROP TABLE "Matches";
ALTER TABLE "new_Matches" RENAME TO "Matches";
CREATE TABLE "new_Teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team_number" INTEGER NOT NULL,
    "competition_name" TEXT NOT NULL,
    CONSTRAINT "Teams_competition_name_fkey" FOREIGN KEY ("competition_name") REFERENCES "Competitions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Teams" ("competition_name", "id", "team_number") SELECT "competition_name", "id", "team_number" FROM "Teams";
DROP TABLE "Teams";
ALTER TABLE "new_Teams" RENAME TO "Teams";
