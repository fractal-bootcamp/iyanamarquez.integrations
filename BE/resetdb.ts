import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    await prisma.$executeRaw`DELETE FROM "Message"`;
    await prisma.$executeRaw`DELETE FROM "Recipient"`;
    await prisma.$executeRaw`DELETE FROM "Sender"`;
    await prisma.$executeRaw`DELETE FROM "MailingList"`;
    await prisma.$executeRaw`DELETE FROM "EmailBlast"`;
    console.log("All tables cleared successfully.");
  } catch (error) {
    console.error("Error clearing tables:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
