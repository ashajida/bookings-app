/*
  Warnings:

  - You are about to drop the `BlockedDates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BlockedDates";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BlockedDate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "BlockedDate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockedDate_userId_key" ON "BlockedDate"("userId");
