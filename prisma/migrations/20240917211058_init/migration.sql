-- CreateTable
CREATE TABLE "OperationTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "opening" DATETIME NOT NULL,
    "closing" DATETIME NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "OperationTime_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OperationTime_ownerId_key" ON "OperationTime"("ownerId");
