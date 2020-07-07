const firebase = require("firebase");
const logToStdErrAndExit = require("./src/helpers/logToStdErrAndExit");
const checkMissingConfig = require("./src/checkMissingConfig");
const parseArgs = require("./src/parseArgs");
const queryDataByTimeInterval = require("./src/queryDataByTimeInterval");
const transformJsonToCsv = require("./src/transformJsonToCsv");
const writeDataToFile = require("./src/writeDataToFile");
const logAndExit = require("./src/helpers/logAndExit");
const generateFilename = require("./src/generateFilename");
const messages = require("./src/constants/messages");
const collectionName = "habitatUse";
const timestampFieldName = "timestamp";
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
    .signInWithEmailAndPassword(process.env.EMAIL, process.env.PASSWORD)
    .catch((e) => logToStdErrAndExit(e.message));

  const timerangeJsonData = await queryDataByTimeInterval(
    startDate,
    endDate,
    timestampFieldName,
    firebase.firestore(),
    collectionName
  );
  if (timerangeJsonData.length === 0) logAndExit(messages.NO_DATA);

  const csvData = transformJsonToCsv(timerangeJsonData);

  const fileName = generateFilename(startDate, endDate);
  writeDataToFile(dirName, fileName, csvData);
};

module.exports = exportData;
