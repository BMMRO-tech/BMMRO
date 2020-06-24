const fs = require("fs");
const { parse, isValid } = require("date-fns");
const firebase = require("firebase");
const json2csv = require("json2csv").parse;
require("dotenv").config();

const CollectionNames = { HABITAT_USE: "habitatUse" };
const DATE_FORMAT = "dd/MM/yyyy";
const TIMESTAMP_FIELD_NAME = "timestamp";
const EXPORTED_DATA_DIR_NAME = "exported";

const errorType = {
  MISSING_ENV_VAR:
    "Missing env variable(s). Make sure you defined PROJECT_ID, API_KEY, AUTH_DOMAIN, USERNAME and PASSWORD.",
  MISSING_ARG:
    "Missing script argument(s). Make sure you defined start date and and date.",
  INVALID_DATE_FORMAT: "Dates must be in format dd/MM/yyyy",
  END_DATE_BEFORE_START_DATE: "End date must be after start date",
};

const initializeApp = () => {
  if (
    !process.env.PROJECT_ID ||
    !process.env.API_KEY ||
    !process.env.AUTH_DOMAIN
  ) {
    throw new Error(errorType.MISSING_ENV_VAR);
  }

  const config = {
    projectId: process.env.PROJECT_ID,
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
  };

  firebase.initializeApp(config);
};

const authenticateUser = async () => {
  if (!process.env.USERNAME || !process.env.PASSWORD) {
    throw new Error(errorType.MISSING_ENV_VAR);
  }

  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  await firebase.auth().signInWithEmailAndPassword(username, password);
};

const queryDataByTimeInterval = async (firestoreInstance, collection) => {
  if (!process.argv[2] || !process.argv[3]) {
    throw new Error(errorType.MISSING_ARG);
  }

  const startDate = parse(process.argv[2], DATE_FORMAT, new Date());
  const endDate = parse(process.argv[3], DATE_FORMAT, new Date());

  if (!isValid(startDate) || !isValid(endDate)) {
    throw new Error(errorType.INVALID_DATE_FORMAT);
  }

  if (startDate > endDate) {
    throw new Error(errorType.END_DATE_BEFORE_START_DATE);
  }

  const result = await firestoreInstance
    .collection(collection)
    .where(TIMESTAMP_FIELD_NAME, ">=", startDate)
    .where(TIMESTAMP_FIELD_NAME, "<", endDate)
    .get();

  if (result.empty) {
    throw new Error("There are no entries within given time range");
  }

  return result;
};

const transformDataToCsvFormat = (data) => {
  const jsondata = [];
  data.forEach((doc) => {
    const object = doc.data();
    jsondata.push(object);
  });

  return json2csv(jsondata);
};

const writeDataToFile = (dirName, fileName, data) => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  const path = `${dirName}/${fileName}`;
  fs.writeFile(path, data, () => console.log("Data has been saved in: ", path));
};

const exportDataToCSV = async () => {
  try {
    initializeApp();
    await authenticateUser();

    const firestore = firebase.firestore();
    const queryData = await queryDataByTimeInterval(
      firestore,
      CollectionNames.HABITAT_USE
    );

    const csv = transformDataToCsvFormat(queryData);
    const fileName = "exportedDB.csv";
    writeDataToFile(EXPORTED_DATA_DIR_NAME, fileName, csv);
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.exportDataToCSV = exportDataToCSV;
