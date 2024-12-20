-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomerBooking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    CONSTRAINT "CustomerBooking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CustomerBooking_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CustomerBooking" ("bookingId", "customerId", "id") SELECT "bookingId", "customerId", "id" FROM "CustomerBooking";
DROP TABLE "CustomerBooking";
ALTER TABLE "new_CustomerBooking" RENAME TO "CustomerBooking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
