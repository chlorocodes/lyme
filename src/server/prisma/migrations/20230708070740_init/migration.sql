-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);
