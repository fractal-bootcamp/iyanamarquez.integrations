import https from "https";
import { GristTablesResponse, Table } from "./types";
const GRIST_KEY = process.env.GRIST_KEY;
// const docId = "jwCdg4Ffpuag";

// gets project id and returns all tables
export const getAllGristTables = (
  docId: string
): Promise<GristTablesResponse> => {
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

// Creates a new table in grist, and returns the new table
export const createGristTable = async (
  docId: string,
  tableToADD: any
): Promise<Table> => {
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

  const newlyCreatedTable = await new Promise((resolve, reject) => {
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
          console.log("data is ", data);
          resolve(JSON.parse(data) as GristTablesResponse);
        });
      })
      //   .write())
      .end(JSON.stringify(tableToADD));
  });
  // returns name of new table made
  const newTableNameInfo: string = (newlyCreatedTable as GristTablesResponse)
    .tables[0].id;
  // use name to do lookup for actual table info
  const newTable = await getGristTableFromName(docId, newTableNameInfo);

  console.log("newTable is ", newTable);
  return newTable as Table;
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
  //   before this, i need to make sure adding to grist, causes the db to get new emails added
  console.log("dataToADD is ", dataToADD);
  //   Adds data from LOCAL DB to grist table
  return new Promise((resolve, reject) => {
    const options = {
      host: "docs.getgrist.com",
      //   port: 443,
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

// need to do a sync that gets data from grist, and then compares it to local db

export const getGristTableFromName = async (
  docId: string,
  tableName: string
): Promise<Table | undefined> => {
  const tablecontents = await getAllGristTables(docId);
  const table = tablecontents.tables.find(
    (table: Table) => table.id === tableName
  );
  return table;
};
