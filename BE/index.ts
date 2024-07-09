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

import {
  createNewMailingList,
  deleteMailingList,
  getMailingList,
  getMailingListDetails,
  getMailingListsByUserId,
  removeEmailFromMailingList,
  updateMailingList,
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
    const mailinglistName = req.body.mailinglistName;
    const recipientsList = req.body.recipientsList;
    const user = req.user;
    const newList = await createNewMailingList(
      user,
      mailinglistName,
      recipientsList
    );

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
    res.send(mailinglist);
  }
);

app.get(
  "/mailinglists/:id",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    const mailingListId = Number(req.params.id);
    const mailingList = await getMailingList(mailingListId);
    res.send(mailingList);
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
    const blastMail = await createNewBlastMail(
      senderId,
      subject,
      message,
      mailingListId
    );
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

app.put("/removeUser/mailinglists/:id", async (req, res) => {
  const mailListId = Number(req.params.id);
  const recipientId = Number(req.body.recipientId);
  const mailingList = await removeEmailFromMailingList(mailListId, recipientId);
  res.send(mailingList);
});

app.put("/updateMailingList/:id", async (req, res) => {
  const mailListId = Number(req.params.id);
  const recipientDetails = req.body.recipientDetails;
  const mailingList = await updateMailingList(mailListId, recipientDetails);
  res.send(mailingList);
});

app.delete("/delete/mailinglist/:id", async (req, res) => {
  const mailListId = Number(req.params.id);
  const mailingList = await deleteMailingList(mailListId);
  res.send(mailingList);
});
const port = 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
