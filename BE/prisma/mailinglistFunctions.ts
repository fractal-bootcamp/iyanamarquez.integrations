import { PrismaClient, Sender } from "@prisma/client";
const prisma = new PrismaClient();

// export async function main() {
export const createNewMailingList = async (
  user: Sender,
  mailinglistName: string,
  recipientsList: string[]
) => {
  return await prisma.mailingList.create({
    data: {
      name: mailinglistName,
      senderId: user.id,
      recipients: {
        create: recipientsList.map((email) => ({
          email: email.trim(),
        })),
      },
    },
  });
};

// Function to get all mailing lists from a user ID
export const getMailingListsByUserId = async (userId: number) => {
  const mailingLists = await prisma.mailingList.findMany({
    where: {
      senderId: userId,
    },
    include: {
      recipients: true, // Include recipients to get their details
    },
  });

  return mailingLists;
};

// Function to get mailing list details by ID
export const getMailingListDetails = async (mailingListId: number) => {
  const mailingList = await prisma.mailingList.findUnique({
    where: { id: mailingListId },
    include: { recipients: true },
  });

  if (!mailingList) {
    throw new Error("Mailing list not found");
  }

  return mailingList.recipients.map((recipient) => recipient.email);
};

export const getMailingList = async (mailingListId: number) => {
  const mailingList = await prisma.mailingList.findUnique({
    where: { id: mailingListId },
    include: { recipients: true },
  });

  if (!mailingList) {
    throw new Error("Mailing list not found");
  }

  return mailingList;
};
