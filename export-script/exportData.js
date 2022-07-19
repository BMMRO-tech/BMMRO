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
const queryNestedSubcollectionByDocPath = require("./src/queryNestedSubcollectionByDocPath");

const encounterCollection = "encounter";
const habitatUseSubcollection = "habitatUse";
const biopsySubcollection = "biopsy";
const specimenSubcollection = "specimen";
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
  let biopsyEntries = [];
  for (const encounter of encounterEntries) {
    const habitatUse = await querySubcollectionByDocPath(
      firebase.firestore(),
      encounter.path,
      habitatUseSubcollection
    );
    habitatUseEntries.push(...habitatUse);

    const biopsy = await querySubcollectionByDocPath(
      firebase.firestore(),
      encounter.path,
      biopsySubcollection
    );
    biopsyEntries.push(...biopsy);
  }

  let specimenEntries = [];
  for (const biopsy of biopsyEntries){
    const specimen = await queryNestedSubcollectionByDocPath(
      firebase.firestore(),
      biopsy.path,
      biopsySubcollection,
      specimenSubcollection
    );
    specimen.collectionType = "biopsy";
    specimenEntries.push(...specimen);
  }

  logSection("Transforming to csv format");
  const extendedHabitatUseEntries = populateCollectionValues(
    encounterEntries,
    habitatUseEntries,
    config.subCollectionToEncounter
  );

  const extendedBiopsiesEntries = populateCollectionValues(
    encounterEntries,
    biopsyEntries,
    config.subCollectionToEncounter
  );

  const extendedSpecimenEntries = populateCollectionValues(
    extendedBiopsiesEntries,
    specimenEntries,
    config.biopsyToSpecimen
  )

  const csvEncounters = transformJsonToCsv(encounterEntries, config.encounter);

  let csvHabitatUse;
  if (!!habitatUseEntries.length) {
    csvHabitatUse = transformJsonToCsv(
      extendedHabitatUseEntries,
      config.habitatUse
    );
  }

  let csvBiopsies;
  if (!!biopsyEntries.length) {
    csvBiopsies = transformJsonToCsv(extendedBiopsiesEntries, config.biopsy);
  }

  let csvSpecimen;
  if(!!specimenEntries.length){
    csvSpecimen = transformJsonToCsv(extendedSpecimenEntries, config.specimen)
  } 

  if (options.mark) {
    logSection("Marking records as exported");
    const allEntries = [
      ...encounterEntries,
      ...habitatUseEntries,
      ...biopsyEntries,
      ...specimenEntries,
    ];
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

  let habitatUseFileName;
  if (!!habitatUseEntries.length) {
    habitatUseFileName = generateFilename(
      habitatUseSubcollection,
      startDate,
      endDate
    );
  }

  let biopsyFileName;
  if (!!biopsyEntries.length) {
    biopsyFileName = generateFilename(biopsySubcollection, startDate, endDate);
  }

  let specimenFileName;
  if (!!specimenEntries.length){
    specimenFileName = generateFilename(specimenSubcollection, startDate, endDate);
  }

  writeDataToFile(dirName, encountersFileName, csvEncounters);

  if (!!habitatUseEntries.length) {
    writeDataToFile(dirName, habitatUseFileName, csvHabitatUse);
  }

  if (!!biopsyEntries.length) {
    writeDataToFile(dirName, biopsyFileName, csvBiopsies);
  }

  if (!!specimenEntries.length) {
    writeDataToFile(dirName, specimenFileName, csvSpecimen);
  }

  logAndExit("\nScript complete!");
};

module.exports = exportData;
