export const CollectionNames = {
  ENCOUNTER: "encounter",
  HABITAT_USE: "habitatUse",
  BIOPSY: "biopsy",
  SPECIMEN: "specimen",
  PROJECT: "project",
  TRIP: "trip",
  LOGBOOK_ENTRY: "logbookEntry",
};

export const generateEncounterPath = (id) => {
  return `${CollectionNames.ENCOUNTER}/${id}`;
};

export const generateTripPath = (id) => {
  return `${CollectionNames.TRIP}/${id}`;
};

export const generateLogbookPath = (tripId, logbookEntryId) => {
  return `${CollectionNames.TRIP}/${tripId}/${CollectionNames.LOGBOOK_ENTRY}/${logbookEntryId}`;
};

export const generateHabitatUsePath = (encounterId, habitatUseId) => {
  return `${CollectionNames.ENCOUNTER}/${encounterId}/${CollectionNames.HABITAT_USE}/${habitatUseId}`;
};

export const generateBiopsyPath = (encounterId, biopsyId) => {
  return `${CollectionNames.ENCOUNTER}/${encounterId}/${CollectionNames.BIOPSY}/${biopsyId}`;
};

export const generateSpecimenPath = (encounterId, biopsyId, specimenId) => {
  return `${CollectionNames.ENCOUNTER}/${encounterId}/${CollectionNames.BIOPSY}/${biopsyId}/${CollectionNames.SPECIMEN}/${specimenId}`;
};

// export const generateProjectPath = () => {
//   return `${CollectionNames.PROJECT}`;
// };

export const DatastoreErrorType = {
  INITIALIZATION: "initialization",
  UNKNOWN_OFFLINE_SUPPORT: "unknown-offline-support",
  MULTIPLE_TABS: "multiple-tabs",
  BROWSER_NOT_SUPPORTED: "browser-not-supported",
  COLLECTION_ITEM_CREATION: "collection-item-creation",
  COLLECTION_READ: "collection-read",
  DOCUMENT_UPDATE: "document-update",
  UPDATES_SUBSCRIPTION: "updates-subscription",
};
