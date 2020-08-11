const firebase = require("firebase");
const logToStdErrAndExit = require("./src/helpers/logToStdErrAndExit");
const checkMissingConfig = require("./src/checkMissingConfig");
const parseDates = require("./src/parseDates");
const queryCollectionByTimeRange = require("./src/queryCollectionByTimeRange");
const querySubcollectionByDocPath = require("./src/querySubcollectionByDocPath");
const populateCollectionValues = require("./src/populateCollectionValues");
const transformJsonToCsv = require("./src/transformJsonToCsv");
const writeDataToFile = require("./src/writeDataToFile");
const logSection = require("./src/helpers/logSection");
const logAndExit = require("./src/helpers/logAndExit");
const generateFilename = require("./src/generateFilename");
const updateInBatch = require("./src/updateInBatch");
const getMessage = require("./src/constants/getMessage");
const config = require("./src/constants/fieldMaps");

const encounterCollection = "encounter";
const habitatUseSubcollection = "habitatUse";
const timestampFieldName = "startTimestamp";
const dirName = "./exported";

const exportData = async (startDateArg, endDateArg, options) => {
  const configStatus = checkMissingConfig(
    process.env.PROJECT_ID,
    process.env.API_KEY,
    process.env.AUTH_DOMAIN,
    process.env.EMAIL,
    process.env.PASSWORD
  );
  if (!configStatus.isSuccessful()) logToStdErrAndExit(configStatus.value);

  const argsStatus = parseDates(startDateArg, endDateArg);
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

  logSection("Fetching data from Firestore");
  const encounterEntries = await queryCollectionByTimeRange(
    startDate,
    endDate,
    timestampFieldName,
    firebase.firestore(),
    encounterCollection,
    !options.all
  ).catch((e) => logToStdErrAndExit(e.message));
  if (encounterEntries.length === 0) logAndExit(getMessage("NO_DATA"));

  let habitatUseEntries = [];
  for (const encounter of encounterEntries) {
    const habitatUse = await querySubcollectionByDocPath(
      firebase.firestore(),
      encounter.path,
      habitatUseSubcollection
    );
    habitatUseEntries.push(...habitatUse);
  }
  if (habitatUseEntries.length === 0) logAndExit(getMessage("NO_DATA"));

  logSection("Transforming to csv format");
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

  if (options.mark) {
    logSection("Marking records as exported");
    const allEntries = [...encounterEntries, ...habitatUseEntries];
    if (allEntries.length > 500) {
      logToStdErrAndExit(
        getMessage("BATCH_UPDATE_LIMIT_EXCEEDED", {
          numberOfEntries: allEntries.length,
        })
      );
    }

    const updateStatus = await updateInBatch(firebase.firestore(), allEntries, {
      exported: true,
      exportedOn: new Date(),
    });
    if (!updateStatus.isSuccessful()) logToStdErrAndExit(updateStatus.value);
  }

  logSection("Writing csv data to files");
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

  logAndExit("\nScript complete!");
};

module.exports = exportData;
