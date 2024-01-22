-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "google_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expires_at" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team_number" INTEGER NOT NULL,
    "competition_name" TEXT NOT NULL,
    CONSTRAINT "Teams_competition_name_fkey" FOREIGN KEY ("competition_name") REFERENCES "Competitions" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Competitions" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "secret" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_queuing" BOOLEAN NOT NULL,
    "is_done" BOOLEAN NOT NULL,
    "competition_name" TEXT NOT NULL,
    CONSTRAINT "Matches_competition_name_fkey" FOREIGN KEY ("competition_name") REFERENCES "Competitions" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamToMatch" (
    "alliance" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,

    PRIMARY KEY ("team_id", "match_id"),
    CONSTRAINT "TeamToMatch_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamToMatch_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CompetitionsToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CompetitionsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Competitions" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompetitionsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_google_id_key" ON "Users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionsToUsers_AB_unique" ON "_CompetitionsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionsToUsers_B_index" ON "_CompetitionsToUsers"("B");
