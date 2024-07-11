import https from "https";

const GRIST_KEY = process.env.GRIST_KEY;

const grist = new Grist({
  apiKey: GRIST_KEY,
});

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
    });
  })
  .on("error", function (e) {
    console.error(`Problem with request: ${e.message}`);
  })
  .end();
