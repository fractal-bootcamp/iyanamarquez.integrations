import { PrismaClient, Sender } from "@prisma/client";
const prisma = new PrismaClient();

// export async function main() {
export const createNewMailingList = async (
  user: Sender,
  mailinglistName: string,
  recipientsList: string[]
) => {
  const recipientsData = await Promise.all(
    recipientsList.map(async (email) => {
      const existingRecipient = await prisma.recipient.findUnique({
        where: { email: email.trim() },
      });

      if (existingRecipient) {
        return { id: existingRecipient.id };
      } else {
        const newRecipient = await prisma.recipient.create({
          data: { email: email.trim() },
        });
        return { id: newRecipient.id };
      }
    })
  );

  return await prisma.mailingList.create({
    data: {
      name: mailinglistName,
      senderId: user.id,
      recipients: {
        connect: recipientsData,
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

export const removeEmailFromMailingList = async (
  mailingListId: number,
  recipientId: number
) => {
  const mailingList = await prisma.mailingList.update({
    where: { id: mailingListId },
    data: {
      recipients: {
        delete: {
          id: recipientId,
        },
      },
    },
  });

  return mailingList;
};

export const updateMailingList = async (
  mailingListId: number,
  recipientDetails: { email: string }
) => {
  // Check if the recipient already exists
  const existingRecipient = await prisma.recipient.findUnique({
    where: { email: recipientDetails.email },
  });

  let recipientId;

  if (existingRecipient) {
    recipientId = existingRecipient.id;
  } else {
    // Create a new recipient
    const newRecipient = await prisma.recipient.create({
      data: { email: recipientDetails.email },
    });
    recipientId = newRecipient.id;
  }

  // Link the recipient to the mailing list
  const mailingList = await prisma.mailingList.update({
    where: { id: mailingListId },
    data: {
      recipients: {
        connect: { id: recipientId },
      },
    },
  });

  return mailingList;
};

export const deleteMailingList = async (mailingListId: number) => {
  const mailingList = await prisma.mailingList.delete({
    where: { id: mailingListId },
  });
  return mailingList;
};
