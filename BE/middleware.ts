import "dotenv/config"; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import { clerkClient, LooseAuthProp } from "@clerk/clerk-sdk-node";
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

declare global {
  interface CustomRequest extends Request {
    user?: any;
  }
}

const prisma = new PrismaClient();

const optionalUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as Request & LooseAuthProp).auth?.userId;
  if (!userId) {
    return next(new Error("User ID is null"));
  }
  const clerkUser = await clerkClient.users.getUser(userId);
  const clerkId = clerkUser.id;
  const clerkEmail = clerkUser.emailAddresses[0].emailAddress;

  if (!clerkId) {
    console.log("no clerkId");
    return next();
  }

  const user = await prisma.sender.findUnique({
    where: {
      clerkId: clerkId,
    },
  });

  if (user) {
    // append user to request context
    req.user = user;
  } else {
    // otherwise create a new user and append to request context
    req.user = await prisma.sender.create({
      data: {
        clerkId: clerkId,
        email: clerkEmail,
      },
    });
  }

  next();
};

export default optionalUser;
