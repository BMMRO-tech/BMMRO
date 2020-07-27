import "firebase/firestore";
import { CollectionNames, DatastoreErrorType } from "../constants/datastore";

export class DatastoreError extends Error {
  constructor(errorType) {
    super(errorType);
    this.name = "DatastoreError";
  }
}

export class Datastore {
  constructor(firestore, enableLogging = true) {
    this.firestore = firestore;
    this.enableLogging = enableLogging;
  }

  async readDocById(id, collectionName) {
    try {
      const docRef = await this.firestore
        .collection(collectionName)
        .doc(id)
        .get();
      return docRef.data();
    } catch (e) {
      this.enableLogging && console.error(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  async createHabitatUse(openEncounterId, values) {
    try {
      const docRef = await this.firestore
        .collection(CollectionNames.ENCOUNTER)
        .doc(openEncounterId)
        .collection(CollectionNames.HABITAT_USE_TEST)
        .add(values);
      return docRef.id;
    } catch (e) {
      throw new DatastoreError(DatastoreErrorType.COLLECTION_ITEM_CREATION);
    }
  }

  async readEncounterById(id) {
    try {
      const docRef = await this.firestore
        .collection(CollectionNames.ENCOUNTER)
        .doc(id)
        .get();

      return docRef.data();
    } catch (e) {
      console.log(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  async readHabitatUseByEncounterId(id) {
    try {
      const docRefs = await this.firestore
        .collection(CollectionNames.ENCOUNTER)
        .doc(id)
        .collection(CollectionNames.HABITAT_USE_TEST)
        .get();

      const results = [];
      docRefs.forEach((doc) => results.push(doc.data()));
      return results;
    } catch (e) {
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
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
