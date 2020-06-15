import "firebase/firestore";
import { CollectionNames, DatastoreErrorType } from "./constants";

export class DatastoreError extends Error {
  constructor(errorType) {
    super(errorType);
    this.name = "DatastoreError";
  }
}

export class Datastore {
  constructor(firestore) {
    this.firestore = firestore;
  }

  async createHabitatUse(values) {
    try {
      const result = await this.firestore
        .collection(CollectionNames.HABITAT_USE)
        .add(values);
      return result.id;
    } catch (e) {
      throw new DatastoreError(DatastoreErrorType.COLLECTION_ENTRY);
    }
  }

  subscribeToPendingHabitatUseRecords(saveRecords) {
    try {
      this.firestore
        .collection(CollectionNames.HABITAT_USE)
        .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
          const records = querySnapshot.docs
            .filter((doc) => doc.metadata.hasPendingWrites)
            .map((doc) => doc.data());
          saveRecords(records);
        });
    } catch (e) {
      throw new DatastoreError(DatastoreErrorType.UPDATES_SUBSCRIPTION);
    }
  }

  async enableOfflineStorage() {
    try {
      await this.firestore.enablePersistence();
    } catch (err) {
      if (err.code === "failed-precondition") {
        throw new DatastoreError(DatastoreErrorType.MULTIPLE_TABS);
      } else if (err.code === "unimplemented") {
        throw new DatastoreError(DatastoreErrorType.BROWSER_NOT_SUPPORTED);
      } else {
        throw new DatastoreError(DatastoreErrorType.UNKNOWN_OFFLINE_SUPPORT);
      }
    }
  }
}

export const initFirestore = (firebase) => {
  try {
    return firebase.firestore();
  } catch (e) {
    throw new DatastoreError(DatastoreErrorType.INITIALIZATION);
  }
};
