import { PrismaClient, Sender, Recipient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createNewBlastMail(
  senderId: number,
  subject: string,
  message: string,
  mailingListId: number
) {
  const mailingList = await prisma.mailingList.findUnique({
    where: { id: mailingListId },
    include: { recipients: true },
  });

  if (!mailingList) {
    throw new Error("Mailing list not found");
  }
  return await prisma.emailBlast.create({
    data: {
      subject: subject,
      senderId: senderId,
      targetListId: mailingListId,
      body: message,
    },
  });
}

export async function getAllBlasts(senderId: number) {
  return await prisma.emailBlast.findMany({
    where: {
      senderId: senderId,
    },
    include: {
      sender: true,
      targetList: true,
    },
  });
}
