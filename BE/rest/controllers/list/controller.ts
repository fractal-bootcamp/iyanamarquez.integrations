import express from "express";
import optionalUser from "../../../middleware";
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
} from "../../../prisma/mailinglistFunctions";
import https from "https";
const GRIST_KEY = process.env.GRIST_KEY;

const listRouter = express.Router();

listRouter.get("/", (_req, res) => {
  res.send("hello base list route");
});

listRouter.post(
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
    console.log("creating new email list");

    res.send(newList);
  }
);

listRouter.get(
  "/mailinglists",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    const userId = req.user.id;
    const mailinglist = await getMailingListsByUserId(userId);
    res.send(mailinglist);
  }
);

listRouter.get(
  "/mailinglists/:id",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    const mailingListId = Number(req.params.id);
    const mailingList = await getMailingList(mailingListId);
    res.send(mailingList);
  }
);

listRouter.put("/removeUser/mailinglists/:id", async (req, res) => {
  const mailListId = Number(req.params.id);
  const recipientId = Number(req.body.recipientId);
  const mailingList = await removeEmailFromMailingList(mailListId, recipientId);
  res.send(mailingList);
});

listRouter.delete("/delete/mailinglist/:id", async (req, res) => {
  const mailListId = Number(req.params.id);
  const mailingList = await deleteMailingList(mailListId);
  res.send(mailingList);
});

listRouter.put("/updateMailingList/:id", async (req, res) => {
  const docId = "jwCdg4Ffpuag";
  const tableId = "1";
  const mailListId = Number(req.params.id);
  console.log("mailListId is ", mailListId);
  const recipientDetails = req.body.recipientDetails;
  // adds a user to mailing list
  const updatedMailingList = await updateMailingList(
    mailListId,
    recipientDetails
  );
  // prevents duplate from being added
  if (updatedMailingList) {
    console.log("updatedMailingList is ", updatedMailingList);
    let dataToADD = {
      records: [
        {
          fields: {
            A: recipientDetails.name,
            B: recipientDetails.email,
          },
        },
      ],
    };
    // TODO: update grist to match my db

    console.log("dataToADD is ", dataToADD);
    var options = {
      host: "docs.getgrist.com",
      port: 443, // Use 443 for HTTPS
      path: `/api/docs/${docId}/tables/${tableId}/records`,
      method: "POST",
      body: JSON.stringify(dataToADD),
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${GRIST_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const reqGrist = https.request(options, function (apiRes) {
      let data = "";
      apiRes.on("data", function (chunk) {
        data += chunk;
      });
      apiRes.on("end", function () {
        console.log(data);
        res.send(data);
      });
    });

    reqGrist.on("error", function (e) {
      console.error(`Problem with request: ${e.message}`);
    });

    reqGrist.write(JSON.stringify(dataToADD));
    reqGrist.end();
  } else {
    console.log("error adding user");
  }
});

export default listRouter;
