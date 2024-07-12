import { PrismaClient, Sender } from "@prisma/client";
import { createGristTable } from "../rest/controllers/list/grist";
const prisma = new PrismaClient();
const docId = "jwCdg4Ffpuag";

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

  // create a new grist table, get the id and attach it to the mailing list
  const dataToADD = {
    tables: [
      {
        id: mailinglistName,
        columns: [
          {
            id: "email",
            fields: {
              label: "Email",
            },
          },
          {
            id: "name",
            fields: {
              label: "Name",
            },
          },
        ],
      },
    ],
  };
  const gristTable = await createGristTable(docId, dataToADD);

  return await prisma.mailingList.create({
    data: {
      name: mailinglistName,
      senderId: user.id,
      recipients: {
        connect: recipientsData,
      },
      gristTableId: Number(gristTable.id),
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
  recipientDetails: string[]
) => {
  const recipientIds = await Promise.all(
    recipientDetails.map(async (email) => {
      const existingRecipient = await prisma.recipient.findUnique({
        where: { email: email.trim() },
      });

      if (existingRecipient) {
        console.log("user exists");
        return existingRecipient.id;
      } else {
        console.log("user does not exist");
        const newRecipient = await prisma.recipient.create({
          data: { email: email.trim() },
        });
        return newRecipient.id;
      }
    })
  );

  // Link the recipients to the mailing list
  const mailingList = await prisma.mailingList.update({
    where: { id: mailingListId },
    data: {
      recipients: {
        connect: recipientIds.map((id) => ({ id })),
      },
    },
    include: { recipients: true },
  });

  return mailingList;
};

export const deleteMailingList = async (mailingListId: number) => {
  const mailingList = await prisma.mailingList.delete({
    where: { id: mailingListId },
  });
  return mailingList;
};

// need to sync db tables with grist table
export const syncMailingList = async (
  mailingListId: number,
  gristTableData: any
) => {
  let mailingList = await prisma.mailingList.findUnique({
    where: { id: mailingListId },
  });
  console.log("mailingList iss ", mailingList);

  const recipientsData = await Promise.all(
    gristTableData.map(async (email) => {
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

  if (!mailingList) {
    mailingList = await prisma.mailingList.create({
      data: {
        name: mailinglistName,
        senderId: user.id,
        recipients: {
          connect: recipientsData,
        },
      },
    });
  } else {
    await prisma.mailingList.update({
      where: { id: mailingListId },
      data: {
        recipients: {
          connect: recipientsData,
        },
      },
    });
  }
  return mailingList;
};
export const linkMailingListToGristTable = async (
  mailingListId: number,
  gristTableId: number
) => {
  console.log("ehllo");
  const mailingList = await prisma.mailingList.update({
    where: { id: 3 },
    data: { gristTableId: gristTableId },
  });
  return mailingList;
};
