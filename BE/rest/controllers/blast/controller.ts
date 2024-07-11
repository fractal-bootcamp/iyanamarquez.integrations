import express from "express";
import optionalUser from "../../../middleware";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import {
  createNewBlastMail,
  getAllBlasts,
} from "../../../prisma/blastmailFunctions";

const blastRouter = express.Router();

blastRouter.get(
  "/getAllBlasts",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    const userId = req.user.id;
    const blasts = await getAllBlasts(userId);
    res.send(blasts);
  }
);

blastRouter.post(
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
export default blastRouter;
