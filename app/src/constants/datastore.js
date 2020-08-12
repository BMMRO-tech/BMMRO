export const CollectionNames = {
  ENCOUNTER: "encounter",
  HABITAT_USE: "habitatUse",
};

export const generateEncounterPath = (id) => {
  return `${CollectionNames.ENCOUNTER}/${id}`;
};

export const generateHabitatUsePath = (encounterId, habitatUseId) => {
  return `${CollectionNames.ENCOUNTER}/${encounterId}/${CollectionNames.HABITAT_USE}/${habitatUseId}`;
};

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
