const { google } = require("googleapis");
const dotenv = require("dotenv");
// type: "service_account",
//     project_id: `${process.env.GOOGLE_SHEET_PROJECT_ID}`,
//     private_key_id: `${process.env.GOOGLE_SHEET_KEY_ID}`,
//     private_key: `${process.env.GOOGLE_SHEET_KEY}`,
//     client_email: `${process.env.GOOGLE_SHEET_CLIENT_EMAIL}`,
//     client_id: `${process.env.GOOGLE_SHEET_CLIENT_ID}`,
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url:
//       "https://www.googleapis.com/robot/v1/metadata/x509/sheettesting%40crested-studio-429304-f7.iam.gserviceaccount.com",
//     universe_domain: "googleapis.com",
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: "crested-studio-429304-f7",
    private_key_id: "87b3292decea830b9de463afeb7b780337522490",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD1deBr+R6JpQlQ\n1/xS0sLcF/lB+zR08g5rYTqYCIcCLps5eWvCnKCgbHTvtAOh9UHnAl3S4UZKkt/W\nUCleTmX5ZONVFUK9dDdMyQGXPJvR82N/ypWcadSp+GHyxv87c9eYzKGvjPP1k16F\nFu/VaJL3ayhF1QT0nT0kqmQTXjPHEotfw7hxRAkXeKqHH0Z2LXpA8DZHQPl/eGkg\nnrmIKaFwm8cG1t2UoYpqbm4MdQaMDSczOpbeDq3G4jaaqDuhNu8/viIPYnTMtenp\nIPs/e05cTqJWGhqqkiPfUC+PGS6OGLec63duPqz9+CNFpwnN4sM+hhHdIbTuBwmn\nn/DJdKyvAgMBAAECggEAEnE012f0P2tC8+wGbUKgmWDDvY1eN5soMjEv8dRSMHvH\n9d2Fly2lc+gyMQBZdYWz2eN3oSyD136JitSjBw7k4oQOAIqEZS+iKAbCM9a97lxX\nEXbrHsFk1RBwa4lAC/t8K2LUkxgIDF9yLpW2l1YwFJ7ce8KxiJ93xJV4x2vAgChi\n3NOc6HfUSgm2GJaf+j77K7BxM7Vj1m/V04/TFjfrB7MpRtH/3nj8F+VPF5OEqjHX\nr5teZc2r3CR/eQF9EKSgG5MbaCkwE1Ry5FjlqaQRoJUNZg2XFLq23v9DAv3zSPXd\nFRYtv4hTAy0XjfSMjo+Mx8bfemXuVZT8qEluHCKRIQKBgQD9ATVv4mN3LUnaukfe\n384iC7fcKaU6IXnG8darceExDlQi7pdsfKfjx/9sdZPsmm6BI3FDgN3lYs+nBFIF\nUGIH/QGYz49hrHXaWKOHvBI65SVUpMIXueRGp1wLY2Q+JzVm1MncTRej69RRepAq\ntC0ca4Afuo/fdH3Q3CmYYGK/7QKBgQD4Xc2fENCEghktQ1d6rK2sFdaQYrmCcY9c\nVtUE1J54TmjdLlROVvFoM089pOKLZseE66Z972Iw5qdF5BBwBKFKPV7MdXKRihM7\n0ZfB/Zn8I9ZumNtiRg7Lc/GKlA2eutgv+n8KgfReXGBm822rKA2nRnWo3d6IjfOU\n2vNpzDtziwKBgQDLHphPLfra6EId12Xx+c4dKTlACTM8ezmwTeIhnHjFkJJdxR1O\nnLmRNrTK146d6tIC3XiGUERVb8H0fZR37bP2Y9pPW3vqV7H6TSVkyMn9/I++59Nn\nhvdM/fn4rqABAituVjGFq2LqWGAJ1hM+JY79/RRM5NOy+2wzLT47tk4xdQKBgQCI\nAVYINPz6kwOWdboBw22XPp4wkt9jPyxyNFqSOpxM5SMne6dO/u1TUkWiTBiCndXE\nRAb4D46FmMkgzLLzpJVuQg0XiXkjmajOqQehg24/VKCoD6yTNCoF34f1iv2qXkbk\nfxfyeReIVK21srfrchOH9l2YC2dA//rTGNMSrHQh4QKBgHI0c0Jg567RJa6U5lD5\nGS4gFHqagjHPiBY4D/5/UDdZCyJiW73aHwYGWJ0ciwm15pJtmP+sPqZzPZeZdyHU\nvohGf1GqZUY6zCF2ApZnti3kSyT8SIUfxh8QcpG1jRpVE3isNpz/r4N6ZE+sDHNx\nPXk/dVleEU9Li6EndTGG9I1N\n-----END PRIVATE KEY-----\n",
    client_email:
      "sheettesting@crested-studio-429304-f7.iam.gserviceaccount.com",
    client_id: "105786225022625964516",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/sheettesting%40crested-studio-429304-f7.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const jobNumberModel = require("../models/jobNumber");
const getSheetsData = async (req, res, next) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    console.log("this is row", rows);
    var output = [];
    if (rows == undefined) {
      return output;
    } else {
      for (var i = 1; i < rows.length; i++) {
        var row = {
          jobNumber: rows[i][0],
          jobName: rows[i][1],
          initials: rows[i][2],
          generalContractor: rows[i][3],
          jobPM: rows[i][4],
          dateCreated: rows[i][5],
          dateBilled: rows[i][6],
          contractTM: rows[i][7],
          amount: rows[i][8],
          PO: rows[i][9],
          CO: rows[i][10],
          percentageBilled: rows[i][11],
          notes: rows[i][12],
          projectChecklist: rows[i][13],
        };
        // var row = {};
        // row["Job Number"] = rows[i][0];
        // row["Job Name"] = rows[i][1];
        // row["Initials"] = rows[i][2];
        // row["General Contractor"] = rows[i][3];
        // row["Job PM"] = rows[i][4];
        // row["Date Created"] = rows[i][5];
        // row["Date Billed"] = rows[i][6];
        // row["Contract/TM"] = rows[i][7];
        // row["Amount"] = rows[i][8];
        // row["PO"] = rows[i][9];
        // row["CO"] = rows[i][10];
        // row["Percentage Billed"] = rows[i][11];
        // row["Notes"] = rows[i][12];
        // row["Project Checklist"] = rows[i][13];
        output.push(row);
      }
      console.log("###", output);
      return output;
    }
  } catch (error) {
    console.log(error);
  }
};
const syncDataFromSheet = async (req, res, next) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    var output = [];
    for (var i = 1; i < rows.length; i++) {
      var row = {
        jobNumber: rows[i][0],
        jobName: rows[i][1],
        initials: rows[i][2],
        generalContractor: rows[i][3],
        jobPM: rows[i][4],
        dateCreated: rows[i][5],
        dateBilled: rows[i][6],
        contractTM: rows[i][7],
        amount: rows[i][8],
        PO: rows[i][9],
        CO: rows[i][10],
        percentageBilled: rows[i][11],
        notes: rows[i][12],
        projectChecklist: rows[i][13],
      };
      output.push(row);
    }
    await jobNumberModel.deleteMany({});
    await jobNumberModel.insertMany(output);
    res.json({
      message: "Sync from goggle sheets done",
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Sync failed",
      error: true,
    });
  }
};
const addSingleData = async (req, res, next) => {
  const {
    jobNumber,
    jobName,
    initials,
    generalContractor,
    contractTM,
    amount,
    PO,
    CO,
    percentageBilled,
    notes,
    projectChecklist,
    dateCreated,
    dateBilled,
    jobPM,
  } = req.body;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";
  const sheetData = await getSheetsData();
  var resource;
  if (sheetData !== undefined) {
    console.log("here in not undefined");
    if (sheetData.length) {
      resource = {
        values: [
          [
            `${jobNumber}`,
            `${jobName}`,
            `${initials}`,
            `${generalContractor}`,
            `${jobPM}`,
            `${dateCreated}`,
            `${dateBilled}`,
            `${contractTM}`,
            `${amount}`,
            `${PO}`,
            `${CO}`,
            `${percentageBilled}`,
            `${notes}`,
            `${projectChecklist}`,
          ],
        ],
      };
    } else {
      console.log("first time sheets");
      resource = {
        values: [
          [
            "Job Number",
            "Job Name",
            "Initials",
            "General Contractor",
            "Job PM",
            "Date Created",
            "Date Billed",
            "Contract/TM",
            "Amount",
            "PO",
            "CO",
            "Percentage Billed",
            "Notes",
            "Project Checklist",
          ],
          [
            `${jobNumber}`,
            `${jobName}`,
            `${initials}`,
            `${generalContractor}`,
            `${jobPM}`,
            `${dateCreated}`,
            `${dateBilled}`,
            `${contractTM}`,
            `${amount}`,
            `${PO}`,
            `${CO}`,
            `${percentageBilled}`,
            `${notes}`,
            `${projectChecklist}`,
          ],
        ],
      };
    }
  } else {
    console.log("sheets is undefined and in second else");
    resource = {
      values: [
        [
          "Job Number",
          "Job Name",
          "Initials",
          "General Contractor",
          "Job PM",
          "Date Created",
          "Date Billed",
          "Contract/TM",
          "Amount",
          "PO",
          "CO",
          "Percentage Billed",
          "Notes",
          "Project Checklist",
        ],
        [
          `${jobNumber}`,
          `${jobName}`,
          `${initials}`,
          `${generalContractor}`,
          `${jobPM}`,
          `${dateCreated}`,
          `${dateBilled}`,
          `${contractTM}`,
          `${amount}`,
          `${PO}`,
          `${CO}`,
          `${percentageBilled}`,
          `${notes}`,
          `${projectChecklist}`,
        ],
      ],
    };
  }
  try {
    // await sheets.spreadsheets.values.clear({
    //   spreadsheetId,
    //   range,
    // });
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    if (response.status == 200 && response.statusText == "OK") {
      res.json({
        message: "Data added into spreadSheet",
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const deleteResult = async (req, res, next) => {
  const { jobNumber } = req.params;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";
  console.log(jobNumber);
  const allSheets = await getSheetsData();
  const filteredSheets = allSheets.filter(
    (item) => item.jobNumber !== jobNumber
  );
  //   const data = {
  //     values: [getKeyValues(filteredSheets)],
  //   };
  var resource;
  const data = filteredSheets.map((inner) => {
    return [
      inner.jobNumber,
      inner.jobName,
      inner.initials,
      inner.generalContractor,
      inner.jobPM,
      inner.dateCreated,
      inner.dateBilled,
      inner.contractTM,
      inner.amount,
      inner.PO,
      inner.CO,
      inner.percentageBilled,
      inner.notes,
      inner.projectChecklist,
    ];
  });
  if (data && data.length) {
    resource = {
      values: [
        [
          "Job Number",
          "Job Name",
          "Initials",
          "General Contractor",
          "Job PM",
          "Date Created",
          "Date Billed",
          "Contract/TM",
          "Amount",
          "PO",
          "CO",
          "Percentage Billed",
          "Notes",
          "Project Checklist",
        ],
        ...data,
      ],
    };
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
      });
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });
      if (response.status == 200 && response.statusText == "OK") {
        res.json({
          message: "SpreadSheet updated successfully",
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
      });
      if (response.status == 200 && response.statusText == "OK") {
        res.json({
          message: "Spreadsheet Updated Successfully",
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
const editResult = async (req, res, next) => {
  const { newEntry, oldEntry } = req.body;
  console.log("old", oldEntry);
  console.log("newEntry", newEntry);
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";
  const allSheets = await getSheetsData();
  console.log("all sheets before edit", allSheets);
  const allSheetsAfterUpdate = allSheets.map((item) => {
    if (item.jobNumber == oldEntry.jobNumber) {
      item.jobNumber = newEntry.jobNumber;
      item.jobName = newEntry.jobName;
      item.initials = newEntry.initials;
      item.generalContractor = newEntry.generalContractor;
      item.jobPM = newEntry.jobPM;
      item.dateCreated = newEntry.dateCreated;
      item.dateBilled = newEntry.dateBilled;
      item.contractTM = newEntry.contractTM;
      item.amount = newEntry.amount;
      item.PO = newEntry.PO;
      item.CO = newEntry.CO;
      item.percentageBilled = newEntry.percentageBilled;
      item.notes = newEntry.notes;
      item.projectChecklist = newEntry.projectChecklist;
      return item;
    } else {
      return item;
    }
  });
  const data = allSheetsAfterUpdate.map((inner) => {
    return [
      inner.jobNumber,
      inner.jobName,
      inner.initials,
      inner.generalContractor,
      inner.jobPM,
      inner.dateCreated,
      inner.dateBilled,
      inner.contractTM,
      inner.amount,
      inner.PO,
      inner.CO,
      inner.percentageBilled,
      inner.notes,
      inner.projectChecklist,
    ];
  });
  if (data && data.length) {
    resource = {
      values: [
        [
          "Job Number",
          "Job Name",
          "Initials",
          "General Contractor",
          "Job PM",
          "Date Created",
          "Date Billed",
          "Contract/TM",
          "Amount",
          "PO",
          "CO",
          "Percentage Billed",
          "Notes",
          "Project Checklist",
        ],
        ...data,
      ],
    };
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
      });
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });
      if (response.status == 200 && response.statusText == "OK") {
        res.json({
          message: "SpreadSheet updated successfully",
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
const syncDataToSheet = async (req, res, next) => {
  const { data } = req.body;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";

  var resource;

  const customizedValues = data.map((inner) => {
    return [
      inner.jobNumber,
      inner.jobName,
      inner.initials,
      inner.generalContractor,
      inner.jobPM,
      inner.dateCreated,
      inner.dateBilled,
      inner.contractTM,
      inner.amount,
      inner.PO,
      inner.CO,
      inner.percentageBilled,
      inner.notes,
      inner.projectChecklist,
    ];
  });
  resource = {
    values: [
      [
        "Job Number",
        "Job Name",
        "Initials",
        "General Contractor",
        "Job PM",
        "Date Created",
        "Date Billed",
        "Contract/TM",
        "Amount",
        "PO",
        "CO",
        "Percentage Billed",
        "Notes",
        "Project Checklist",
      ],
      ...customizedValues,
    ],
  };
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    if (response.status == 200 && response.statusText == "OK") {
      res.json({
        message: "SpreadSheet updated successfully",
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.syncDataFromSheet = syncDataFromSheet;
exports.addSingleData = addSingleData;
exports.deleteResult = deleteResult;
exports.editResult = editResult;
exports.syncDataToSheet = syncDataToSheet;
