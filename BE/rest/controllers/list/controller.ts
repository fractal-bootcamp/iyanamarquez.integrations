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
import {
  getAllGristTables,
  createGristTable,
  getGristTable,
  syncGristTable,
  getGristTableFromName,
} from "./grist";
const GRIST_KEY = process.env.GRIST_KEY;
const docId = "jwCdg4Ffpuag";
const tableId = "10";
const newTableName = "NewTablee";

const listRouter = express.Router();

listRouter.get("/", async (_req, res) => {
  const tablecontents = await getGristTable(docId, "NewTablee");
  res.send(tablecontents);
});

listRouter.get("/alltables", async (_req, res) => {
  const tablecontents = await getAllGristTables(docId);
  res.send(tablecontents);
});

listRouter.get("/createtable", async (_req, res) => {
  const dataToADD = {
    tables: [
      {
        id: newTableName,
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
  try {
    // undefined new table
    const newTable = await createGristTable(docId, dataToADD);
    console.log("newTable isss44 ", newTable);
    // getgristtablefromname
    const tablecontents = await getAllGristTables(docId);
    const table = tablecontents.tables.find(
      (table: any) => table.id === newTable.id
    );
    // this id allows you to see the actual table
    // can be used to link to mailing list
    const currTableId = table?.fields.primaryViewId;
    res.send(table);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating table");
  }
});

listRouter.get("/synctable", async (_req, res) => {
  const mailingListId = 3;
  // here i want to grab any new emails from grist and then add them to the mailing list
  const gristTableRecipients = await getGristTable(docId, tableId);
  const gristTableRecipientsEmails = gristTableRecipients.records.map(
    (recipient: any) => recipient.fields.email
  );
  // gristTableRecipientsEmails looks like this:
  //   gristTableRecipientsEmails is  [
  //   "cat@mail.com", "dog@mail.com", "doggy@mail.com", "bob@mail.com", "naturegurl21", "erm@sigma.com",
  //   "okayman@bruh.com", "okaaaayman@bruh.com", "helloerm@sigma.com", "hellooerm@sigma.com",
  //   "helloooerm@sigma.com", "ermm@sigma.com", "bruh@bruh.com", "hiya@mail.com", "erjm@sigma.com",
  //   "ermmagawd@sigma.com", "freakbob@mail.com", "fbeukfbeku", "bruheugfikewf@mail.com", "ellonew@bruh.com",
  //   "addnew@mail.com", "burhmoemnt@mail.com", "banana@mail.com", "hiya22@mail.com"
  // ]
  //   prisma call to add emails to db if they are new
  //   returns updated mailing list
  const updatedMailingList = await updateMailingList(
    mailingListId,
    gristTableRecipientsEmails
  );

  //   after adding new emails, just grab all the emails and add them to grist
  const mailingListRecipients = await getMailingListDetails(
    updatedMailingList.id
  );
  const dataToADD = {
    records: mailingListRecipients.map((email) => ({
      require: { email },
      fields: { name: email.split("@")[0] }, // Create a name from the email before the @ symbol
    })),
  };
  try {
    const allTables = await syncGristTable(docId, tableId, dataToADD);
    res.send(allTables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting all tables");
  }
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
  const tableId = "1";
  const mailListId = Number(req.params.id);

  //   console.log("mailListId is ", mailListId);
  const recipientDetails = [req.body.recipientDetails.email];
  console.log("recipientDetails is ", recipientDetails);
  //   recipientDetails is  {
  //   email: "manbruh@mail.com",
  // }
  //   // adds a user to mailing list
  //   may need to fix this later, recipient details is an array now

  const updatedMailingList = await updateMailingList(
    mailListId,
    recipientDetails
  );
  // prevents duplate from being added
  const listOfRecipients = updatedMailingList.recipients;

  if (listOfRecipients.length > 0) {
    let dataToADD = {
      records: listOfRecipients.map((recipient) => ({
        fields: {
          A: recipient.name,
          B: recipient.email,
        },
      })),
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

// performming a sync
// get remote table contents
// compare email data to my local db
// when done, push new contents to remote grist table
