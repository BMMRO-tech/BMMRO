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
const queryCollectionByConditions = require("./src/queryCollectionByConditions");

const encounterCollection = "encounter";
const tripCollection = "trip";
const timestampTripFieldName = "date";
const logbookSubcollection = "logbookEntry";
const habitatUseSubcollection = "habitatUse";
const biopsySubcollection = "biopsy";
const specimenSubcollection = "specimen";
const timestampFieldName = "startTimestamp";
const exportedFieldName = "exported";
const tripEndFieldName = "hasEnded";
const dirName = "./exported";


let habitatUseEntries = [];
let biopsyEntries = [];
let logbookEntries = [];
let specimenEntries = [];

let csvEncounters;
let csvLogbook;
let csvHabitatUse;
let csvBiopsies;
let csvSpecimen;

let encountersFileName;
let logbookFileName;
let habitatUseFileName;
let biopsyFileName;
let specimenFileName;

const exportData = async (startDateArg, endDateArg, options) => {
  const exportedValue = !options.all ? [false] : [true, false]
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
  
  const tripEntries = await queryCollectionByConditions(
    firebase.firestore(),
    tripCollection,
    [
      {key:timestampTripFieldName,value:startDate, operator:">="},
      {key:timestampTripFieldName,value:endDate, operator:"<"},
      {key:exportedFieldName,value: exportedValue, operator:"in"},
      {key:tripEndFieldName, value: true, operator:"=="},
    ],
  ).catch((e) => logToStdErrAndExit(e.message));

  const encounterEntries = await queryCollectionByTimeRange(
    startDate,
    endDate,
    timestampFieldName,
    firebase.firestore(),
    encounterCollection,
    !options.all
  ).catch((e) => logToStdErrAndExit(e.message));

  if (encounterEntries.length === 0 && tripEntries.length === 0) logAndExit(getMessage("NO_DATA"));

  if (tripEntries.length === 0) logSection(getMessage("NO_DATA_SECTION", {section: "trip"}));

  if (encounterEntries.length === 0) logSection(getMessage("NO_DATA_SECTION", {section: "encounter"}));

  for (const trip of tripEntries) {
    const logbook = await querySubcollectionByDocPath(
      firebase.firestore(),
      trip.path,
      logbookSubcollection
    );
    logbookEntries.push(...logbook);
  }

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

  for (const biopsy of biopsyEntries){
    const specimen = await queryNestedSubcollectionByDocPath(
      firebase.firestore(),
      biopsy.path,
      biopsySubcollection,
      specimenSubcollection
    );

    specimen.forEach(specimen => specimen.collectionType = "biopsy");
    specimenEntries.push(...specimen);
  }

  logSection("Transforming to csv format");
  const extendedLogbookEntries = populateCollectionValues(
    tripEntries,
    logbookEntries,
    config.subCollectionToTrip
  );
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

  if (!!encounterEntries.length) {
    csvEncounters = transformJsonToCsv(encounterEntries, config.encounter);
  }

  if (!!logbookEntries.length) {
    csvLogbook = transformJsonToCsv(
      extendedLogbookEntries,
      config.trip
    );
  }

  if (!!habitatUseEntries.length) {
    csvHabitatUse = transformJsonToCsv(
      extendedHabitatUseEntries,
      config.habitatUse
    );
  }

  if (!!biopsyEntries.length) {
    csvBiopsies = transformJsonToCsv(extendedBiopsiesEntries, config.biopsy);
  }

  if(!!specimenEntries.length){
    csvSpecimen = transformJsonToCsv(extendedSpecimenEntries, config.specimen)
  } 

  if (options.mark) {
    logSection("Marking records as exported");
    const allEntries = [
      ...encounterEntries,
      ...logbookEntries,
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
  if (!!encounterEntries.length) { 
   encountersFileName = generateFilename(
    encounterCollection,
    startDate,
    endDate
  );
  }

  if (!!logbookEntries.length) {
    logbookFileName = generateFilename(
      logbookSubcollection,
      startDate,
      endDate
    );
  }

  if (!!habitatUseEntries.length) {
    habitatUseFileName = generateFilename(
      habitatUseSubcollection,
      startDate,
      endDate
    );
  }

  if (!!biopsyEntries.length) {
    biopsyFileName = generateFilename(biopsySubcollection, startDate, endDate);
  }

  if (!!specimenEntries.length){
    specimenFileName = generateFilename(specimenSubcollection, startDate, endDate);
  }

  if (!!encounterEntries.length) { 
    writeDataToFile(dirName, encountersFileName, csvEncounters);
  }

  if (!!logbookEntries.length) {
    writeDataToFile(dirName, logbookFileName, csvLogbook);
  }

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
