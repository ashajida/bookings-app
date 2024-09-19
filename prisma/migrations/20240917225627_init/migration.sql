/*
  Warnings:

  - Added the required column `phone` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Owner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_Owner" ("email", "id", "name") SELECT "email", "id", "name" FROM "Owner";
DROP TABLE "Owner";
ALTER TABLE "new_Owner" RENAME TO "Owner";
CREATE UNIQUE INDEX "Owner_phone_key" ON "Owner"("phone");
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
