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

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const port = 3000;

app.get("/", ClerkExpressRequireAuth({}), optionalUser, (req, res) => {
  res.send("Hello World!");
});

app.post("/sendmail", (req, res) => {
  // TODO: send email VIA email service
  // TODO: save email to database
  console.log(req.body);
  res.send("Email sent");
});

app.get("/emails", (req, res) => {
  // auth to verify user asking for emails sent
  // send back list of emails matching user
  // TODO: get emails from database
  res.send("Emails");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
