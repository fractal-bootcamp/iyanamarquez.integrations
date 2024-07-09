/*
  Warnings:

  - You are about to drop the column `name` on the `EmailBlast` table. All the data in the column will be lost.
  - Added the required column `body` to the `EmailBlast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `EmailBlast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailBlast" DROP COLUMN "name",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;
