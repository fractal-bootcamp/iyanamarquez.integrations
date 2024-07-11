import https from "https";
import { GristTablesResponse } from "./types";
const GRIST_KEY = process.env.GRIST_KEY;
// const docId = "jwCdg4Ffpuag";

// gets project id and returns all tables
export const getAllGristTables = (docId: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      host: "docs.getgrist.com",
      port: 443,
      path: `/api/docs/${docId}/tables`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${GRIST_KEY}`,
      },
    };
    https
      .request(options, function (apiRes) {
        let data = "";
        apiRes.on("data", function (chunk) {
          data += chunk;
        });
        apiRes.on("end", function () {
          console.log("hello", data);
          resolve(JSON.parse(data) as GristTablesResponse);
        });
      })
      .on("error", function (e) {
        reject(`Problem with grist table request: ${e.message}`); // Reject the promise on error
      })
      .end();
  });
};

export const createGristTable = async (
  docId: string,
  tableToADD: any
): Promise<GristTablesResponse> => {
  // example of test data to add
  //     {
  //   "tables": [
  //     {
  //       "id": "Mail",
  //       "columns": [
  //         {
  //           "id": "email",
  //           "fields": {
  //             "label": "Email"
  //           }
  //         },
  //         {
  //           "id": "name",
  //           "fields": {
  //             "label": "Name"
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // }

  return new Promise((resolve, reject) => {
    const options = {
      host: "docs.getgrist.com",
      port: 443,
      path: `/api/docs/${docId}/tables`,
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${GRIST_KEY}`,
      },
    };
    https
      .request(options, function (apiRes) {
        let data = "";
        apiRes.on("data", function (chunk) {
          data += chunk;
        });
        apiRes.on("end", function () {
          resolve(JSON.parse(data) as GristTablesResponse);
        });
      })
      //   .write())
      .end(JSON.stringify(tableToADD));
  });
};

export const getGristTable = async (docId: string, tableId: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      host: "docs.getgrist.com",
      port: 443,
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
        apiRes.on("data", function (chunk) {
          data += chunk;
        });
        apiRes.on("end", function () {
          resolve(JSON.parse(data) as GristTablesResponse);
        });
      })
      //   .write())
      .end();
  });
};

export const syncGristTable = async (
  docId: string,
  tableId: string,
  dataToADD: any
) => {
  // filter the data before adding
  return new Promise((resolve, reject) => {
    const options = {
      host: "docs.getgrist.com",
      port: 443,
      path: `/api/docs/${docId}/tables/${10}/records`,
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${GRIST_KEY}`,
      },
    };
    https
      .request(options, function (apiRes) {
        let data = "";
        apiRes.on("data", function (chunk) {
          data += chunk;
        });
        apiRes.on("end", function () {
          resolve(JSON.parse(data) as GristTablesResponse);
        });
      })
      .end(JSON.stringify(dataToADD));
  });
};
