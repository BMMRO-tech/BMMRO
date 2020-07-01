const fs = require("fs");
const firebase = require("firebase");
const json2csv = require("json2csv").parse;
require("dotenv").config();

const CollectionNames = { HABITAT_USE: "habitatUse" };
const TIMESTAMP_FIELD_NAME = "timestamp";
const EXPORTED_DATA_DIR_NAME = "exported";

const initializeApp = (projectId, apiKey, authDomain) => {
  const config = { projectId, apiKey, authDomain };
  firebase.initializeApp(config);
};

const authenticateUser = async (username, password) => {
  await firebase.auth().signInWithEmailAndPassword(username, password);
};

const queryDataByTimeInterval = async (
  startDate,
  endDate,
  firestoreInstance,
  collection
) => {
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

const exportDataToCSV = async (
  projectId,
  apiKey,
  authDomain,
  email,
  password,
  startDate,
  endDate
) => {
  try {
    initializeApp(projectId, apiKey, authDomain);
    await authenticateUser(email, password);

    const firestore = firebase.firestore();
    const queryData = await queryDataByTimeInterval(
      startDate,
      endDate,
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
