/*
  Warnings:

  - You are about to drop the column `Friday` on the `OperationTime` table. All the data in the column will be lost.
  - You are about to drop the column `Monday` on the `OperationTime` table. All the data in the column will be lost.
  - You are about to drop the column `Saturday` on the `OperationTime` table. All the data in the column will be lost.
  - You are about to drop the column `Sunday` on the `OperationTime` table. All the data in the column will be lost.
  - You are about to drop the column `Thursday` on the `OperationTime` table. All the data in the column will be lost.
  - You are about to drop the column `Tuesday` on the `OperationTime` table. All the data in the column will be lost.
  - You are about to drop the column `Wednesday` on the `OperationTime` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OperationTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "sunday" TEXT,
    "monday" TEXT,
    "tuesday" TEXT,
    "wednesday" TEXT,
    "thursday" TEXT,
    "friday" TEXT,
    "saturday" TEXT,
    CONSTRAINT "OperationTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OperationTime" ("id", "userId") SELECT "id", "userId" FROM "OperationTime";
DROP TABLE "OperationTime";
ALTER TABLE "new_OperationTime" RENAME TO "OperationTime";
CREATE UNIQUE INDEX "OperationTime_userId_key" ON "OperationTime"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
