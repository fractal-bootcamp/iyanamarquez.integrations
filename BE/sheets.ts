import { google } from "googleapis";
import { JWT } from "google-auth-library";

// Load the credentials from the service account key file
const credentials = require("./google-admin.json");

const client = new google.auth.GoogleAuth({
  keyFile: "./google-admin.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const spreadsheetId = "1i57vKT686RmgPuBF6oLxWfC49aQglStdIOrm-jSdpTE";

const sheets = google.sheets({ version: "v4", auth: client });

const spreadsheets = sheets.spreadsheets.get({
  spreadsheetId,
});

console.log("spreadsheets", JSON.stringify(spreadsheets, null, 2));
