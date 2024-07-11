import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { clerkClient } from "@clerk/clerk-sdk-node";
import https from "https";

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
    console.log("creating new email list");

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

app.delete("/delete/mailinglist/:id", async (req, res) => {
  const mailListId = Number(req.params.id);
  const mailingList = await deleteMailingList(mailListId);
  res.send(mailingList);
});

const GRIST_KEY = process.env.GRIST_KEY;

app.get("/grist", async (req, res) => {
  var options = {
    host: "docs.getgrist.com",
    port: 443, // Use 443 for HTTPS
    path: `/api/orgs`,
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${GRIST_KEY}`,
    },
  };

  https
    .request(options, function (apiRes) {
      let data = "";
      console.log("apiRes", apiRes);

      // Collect response data
      apiRes.on("data", function (chunk) {
        data += chunk;
      });

      // Send the complete response back to the client
      apiRes.on("end", function () {
        console.log(data);
        res.send(data);
      });
    })
    .on("error", function (e) {
      console.error(`Problem with request: ${e.message}`);
    })
    .end();
});

app.get(
  "/gristtable/:tableName",
  ClerkExpressRequireAuth({}),
  optionalUser,
  async (req, res) => {
    // eventually replace this get to only get from my db, not grist
    const docId = req.params.tableName;
    const tableId = "1";
    var options = {
      host: "docs.getgrist.com",
      port: 443, // Use 443 for HTTPS
      path: `/api/docs/${docId}/tables/${tableId}/records`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${GRIST_KEY}`,
      },
    };

    https
      .request(options, function (apiRes) {
        let data = "";

        // Collect response data
        apiRes.on("data", function (chunk) {
          data += chunk;
        });

        // Send the complete response back to the client
        apiRes.on("end", function () {
          console.log(data);
          res.send(data);
        });
      })
      .on("error", function (e) {
        console.error(`Problem with request: ${e.message}`);
      })
      .end();
    // return my own db results instead
    // results look like
    //   records: [
    //     { id: 1, fields: { A: "name", B: "email", C: null } },
    //     { id: 2, fields: { A: "bob", B: "bob@mail.com", C: null } },
    //     { id: 3, fields: { A: "patty", B: "patty@mail.com", C: null } },
    //     { id: 4, fields: { A: "steve", B: "steve@mail.com", C: null } },
    //     { id: 5, fields: { A: "john ", B: "john@john.com", C: null } },
    //   ],
  }
);
// post to table

app.put("/updateMailingList/:id", async (req, res) => {
  const docId = "jwCdg4Ffpuag";
  const tableId = "1";
  const mailListId = Number(req.params.id);
  const recipientDetails = req.body.recipientDetails;
  const addedUser = await updateMailingList(mailListId, recipientDetails);
  const mailingList = await getMailingList(mailListId);
  const allRecipients = mailingList.recipients;

  // TODO: update grist to match my db
  let dataToADD = {
    records: allRecipients.map((recipient) => ({
      fields: {
        A: recipient.name,
        B: recipient.email,
      },
    })),
  };
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
});

// app.post("/gristtable", async (req, res) => {
//   const docId = "jwCdg4Ffpuag";
//   const tableId = "1";

//   let dataToADD = {
//     records: [
//       { fields: { name: "dbob", email: "dbob@mail.com" } },
//       { fields: { name: "dpatty", email: "dpatty@mail.com" } },
//     ],
//   };

//   var options = {
//     host: "docs.getgrist.com",
//     port: 443, // Use 443 for HTTPS
//     path: `/api/docs/${docId}/tables/${tableId}/records`,
//     method: "POST",
//     body: JSON.stringify(dataToADD),
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${GRIST_KEY}`,
//       "Content-Type": "application/json",
//     },
//   };

//   https
//     .request(options, function (apiRes) {
//       let data = "";
//       console.log("apiRes", apiRes);

//       // Collect response data
//       apiRes.on("data", function (chunk) {
//         data += chunk;
//       });

//       // Send the complete response back to the client
//       apiRes.on("end", function () {
//         console.log(data);
//         res.send(data);
//       });
//     })
//     .on("error", function (e) {
//       console.error(`Problem with request: ${e.message}`);
//     })
//     .end();
//   // results look like
// });
const port = 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
