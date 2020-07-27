import "firebase/firestore";
import { CollectionNames, DatastoreErrorType } from "../constants/datastore";

export class DatastoreError extends Error {
  constructor(errorType) {
    super(errorType);
    this.name = "DatastoreError";
  }
}

export class Datastore {
  constructor(
    firestore,
    enableLogging = true,
    handleDelayedError = console.error
  ) {
    this.firestore = firestore;
    this.enableLogging = enableLogging;
    this.handleDelayedError = handleDelayedError;
  }

  async readDocById(id, collectionName) {
    try {
      const docRef = this.firestore.collection(collectionName).doc(id);
      const docSnapshot = await docRef.get();
      return { data: docSnapshot.data(), ref: docRef };
    } catch (e) {
      this.enableLogging && console.error(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  async readDocsByParentId(parentId, collectionName, subcollectionName) {
    try {
      const docRefs = await this.firestore
        .collection(collectionName)
        .doc(parentId)
        .collection(subcollectionName)
        .get();

      const results = [];
      docRefs.forEach((doc) => results.push(doc.data()));
      return results;
    } catch (e) {
      this.enableLogging && console.error(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  createDoc(collectionName, values) {
    const docRef = this.firestore.collection(collectionName).doc();
    const id = docRef.id;
    docRef.set(values).catch(this.handleDelayedError);
    return id;
  }

  createSubDoc(subcollectionName, values, parentDoc) {
    const docRef = parentDoc.collection(subcollectionName).doc();
    const id = docRef.id;
    docRef.set(values).catch(this.handleDelayedError);
    return id;
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
