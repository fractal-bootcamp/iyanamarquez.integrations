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

import blastRouter from "./rest/controllers/blast/controller";
import listRouter from "./rest/controllers/list/controller";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/list", listRouter);
app.use("/api/blast", blastRouter);

app.get("/", ClerkExpressRequireAuth({}), optionalUser, (req, res) => {
  res.send("Hello World!");
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
    // TODO change this
    const tableId = "29";
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
  }
);
const port = 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
