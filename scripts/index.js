const firebase = require("firebase");
const logToStdErrAndExit = require("./src/helpers/logToStdErrAndExit");
const checkMissingConfig = require("./src/checkMissingConfig");
const parseArgs = require("./src/parseArgs");
const queryDataByTimeInterval = require("./src/queryDataByTimeInterval");
const transformJsonToCsv = require("./src/transformJsonToCsv");
const writeDataToFile = require("./src/writeDataToFile");
const logAndExit = require("./src/helpers/logAndExit");
const messages = require("./src/messages");
const collectionName = "habitatUse";
const timestampFieldName = "timestamp";
const fileName = "exportedDb.csv";
const dirName = "./exported";

const exportData = async () => {
  const configStatus = checkMissingConfig(
    process.env.PROJECT_ID,
    process.env.API_KEY,
    process.env.AUTH_DOMAIN,
    process.env.EMAIL,
    process.env.PASSWORD
  );
  if (!configStatus.isSuccessful()) logToStdErrAndExit(configStatus.value);

  const argsStatus = parseArgs([...process.argv]);
  if (!argsStatus.isSuccessful()) logToStdErrAndExit(configStatus.value);
  const { startDate, endDate } = argsStatus.value;

  firebase.initializeApp({
    projectId: process.env.PROJECT_ID,
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
  });
  await firebase
    .auth()
    .signInWithEmailAndPassword(process.env.EMAIL, process.env.PASSWORD);

  const timerangeJsonData = await queryDataByTimeInterval(
    startDate,
    endDate,
    timestampFieldName,
    firebase.firestore(),
    collectionName
  );
  if (timerangeJsonData.length === 0) logAndExit(messages.NO_DATA);

  const csvData = transformJsonToCsv(timerangeJsonData);

  writeDataToFile(dirName, fileName, csvData);

  return;
};

exportData();
