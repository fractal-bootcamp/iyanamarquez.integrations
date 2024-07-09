import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { clerkClient } from "@clerk/clerk-sdk-node";
import optionalUser from "./middleware";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";

import { Prisma } from "@prisma/client";
import {
  createNewMailingList,
  getMailingListsByUserId,
} from "./prisma/mailinglistFunctions";
import { createNewBlastMail, getAllBlasts } from "./prisma/blastmailFunctions";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", ClerkExpressRequireAuth({}), optionalUser, (req, res) => {
  res.send("Hello World!");
});

app.post(
  "/new/mailinglist",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    console.log("helooooo");
    const mailinglistName = req.body.mailinglistName;
    const recipientsList = req.body.recipientsList;
    const user = req.user;
    const newList = await createNewMailingList(
      user,
      mailinglistName,
      recipientsList
    );

    console.log("newList made: ", newList);
    res.send(newList);
  }
);

app.get(
  "/mailinglists",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    const userId = req.user.id;
    const mailinglist = await getMailingListsByUserId(userId);
    // console.log("mailinglist: ", mailinglist);
    res.send(mailinglist);
  }
);

app.get(
  "/getAllBlasts",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    const userId = req.user.id;
    const blasts = await getAllBlasts(userId);
    res.send(blasts);
  }
);

app.post(
  "/createBlast",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    // TODO: send email VIA email service
    // TODO: save email to database
    const blastDetails = req.body.emailDetails;
    const senderId = req.user.id;
    const mailingListId = Number(blastDetails.mailList);
    const message = blastDetails.message;
    const subject = blastDetails.subject;
    console.log("here", blastDetails);
    const blastMail = await createNewBlastMail(
      senderId,
      subject,
      message,
      mailingListId
    );
    // console.log("blastMail: ", blastMail);
    res.send(blastMail);
  }
);

// app.get("/emails", (req, res) => {
//   // auth to verify user asking for emails sent
//   // send back list of emails matching user
//   // TODO: get emails from database
//   res.send("Emails");
// });

// export default app;
const port = 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
