import app from "../index";
import optionalUser from "../middleware";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";

app.get("/emails", (req, res) => {
  // auth to verify user asking for emails sent
  // send back list of emails matching user
  // TODO: get emails from database
  res.send("Emails");
});

// app.get("/viewlists", (req, res) => {
//   res.send("Helloo World!");
// });

// app.post("/sendmail", (req, res) => {
//   console.log(req.body);
//   res.send("Email sent");
// });

// app.get("/", ClerkExpressRequireAuth({}), optionalUser, (req, res) => {
//   res.send("Hello World!");
// });
