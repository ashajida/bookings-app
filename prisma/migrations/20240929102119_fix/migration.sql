-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OperationTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "opening" TEXT NOT NULL,
    "closing" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "OperationTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OperationTime" ("closing", "id", "opening", "userId") SELECT "closing", "id", "opening", "userId" FROM "OperationTime";
DROP TABLE "OperationTime";
ALTER TABLE "new_OperationTime" RENAME TO "OperationTime";
CREATE UNIQUE INDEX "OperationTime_userId_key" ON "OperationTime"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
