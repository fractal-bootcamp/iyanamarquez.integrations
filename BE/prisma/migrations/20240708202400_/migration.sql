/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Sender` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sender_clerkId_key" ON "Sender"("clerkId");
