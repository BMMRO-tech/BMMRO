const firebase = require("firebase");
const logToStdErrAndExit = require("./src/helpers/logToStdErrAndExit");
const checkMissingConfig = require("./src/checkMissingConfig");
const parseArgs = require("./src/parseArgs");
const queryCollectionByTimeRange = require("./src/queryCollectionByTimeRange");
const querySubcollectionByDocId = require("./src/querySubcollectionByDocId");
const populateCollectionValues = require("./src/populateCollectionValues");
const transformJsonToCsv = require("./src/transformJsonToCsv");
const writeDataToFile = require("./src/writeDataToFile");
const logAndExit = require("./src/helpers/logAndExit");
const generateFilename = require("./src/generateFilename");
const messages = require("./src/constants/messages");
const config = require("./src/constants/fieldMaps");

const encounterCollection = "encounter";
const habitatUseSubcollection = "habitatUseTest";
const timestampFieldName = "date";
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
  if (!argsStatus.isSuccessful()) logToStdErrAndExit(argsStatus.value);
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

  const encounterEntries = await queryCollectionByTimeRange(
    startDate,
    endDate,
    timestampFieldName,
    firebase.firestore(),
    encounterCollection
  ).catch((e) => logToStdErrAndExit(e.message));
  if (encounterEntries.length === 0) logAndExit(messages.NO_DATA);

  let habitatUseEntries = [];
  for (const encounter of encounterEntries) {
    const habitatUse = await querySubcollectionByDocId(
      firebase.firestore(),
      encounter.id,
      encounterCollection,
      habitatUseSubcollection
    );
    habitatUseEntries.push(...habitatUse);
  }

  const extendedHabitatUseEntries = populateCollectionValues(
    encounterEntries,
    habitatUseEntries,
    config.habitatUseToEncounter
  );

  const csvEncounters = transformJsonToCsv(encounterEntries, config.encounter);
  const csvHabitatUse = transformJsonToCsv(
    extendedHabitatUseEntries,
    config.habitatUse
  );

  const encountersFileName = generateFilename(
    encounterCollection,
    startDate,
    endDate
  );
  const habitatUseFileName = generateFilename(
    habitatUseSubcollection,
    startDate,
    endDate
  );

  writeDataToFile(dirName, encountersFileName, csvEncounters);
  writeDataToFile(dirName, habitatUseFileName, csvHabitatUse);

  logAndExit("Script complete!");
};

module.exports = exportData;
