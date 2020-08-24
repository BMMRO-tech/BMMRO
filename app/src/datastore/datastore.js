import "firebase/firestore";
import { fromUnixTime } from "date-fns";

import { DatastoreErrorType } from "../constants/datastore";

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

  convertTimeObjectToDate = (timeObject) => {
    return fromUnixTime(timeObject.seconds);
  };

  isUnixTimestamp = (value) => {
    return typeof value === "object" && "seconds" in value;
  };

  async readDocByPath(path) {
    try {
      const docRef = this.firestore.doc(path);
      const docSnapshot = await docRef.get();
      const docData = docSnapshot.data();

      for (const property in docData) {
        const value = docData[property];

        if (this.isUnixTimestamp(value)) {
          docData[property] = this.convertTimeObjectToDate(value);
        }
      }

      return { data: docData, path: docRef.path };
    } catch (e) {
      this.enableLogging && console.error(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  async readDocsByParentPath(parentPath, subcollectionName) {
    try {
      const docsSnapshots = await this.firestore
        .doc(parentPath)
        .collection(subcollectionName)
        .get();

      const results = [];
      docsSnapshots.forEach((doc) =>
        results.push({ data: doc.data(), id: doc.id })
      );
      return results;
    } catch (e) {
      this.enableLogging && console.error(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  async readDocsByTimeRange(
    collectionName,
    timestampFieldName,
    startDate,
    endDate
  ) {
    try {
      const docsSnapshots = await this.firestore
        .collection(collectionName)
        .where(timestampFieldName, ">=", startDate)
        .where(timestampFieldName, "<", endDate)
        .orderBy(timestampFieldName, "desc")
        .get();

      const results = [];
      docsSnapshots.forEach((doc) => {
        const docData = doc.data();

        for (const property in docData) {
          const value = docData[property];

          if (this.isUnixTimestamp(value)) {
            docData[property] = this.convertTimeObjectToDate(value);
          }
        }

        results.push({ data: docData, id: doc.id });
      });
      return results;
    } catch (e) {
      this.enableLogging && console.error(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  createDoc(collectionPath, values) {
    const docRef = this.firestore.collection(collectionPath).doc();
    docRef.set(values).catch(this.handleDelayedError);
    return docRef.id;
  }

  createSubDoc(parentPath, subcollectionName, values) {
    return this.createDoc(`${parentPath}/${subcollectionName}`, values);
  }

  updateDocByPath(path, values) {
    const docRef = this.firestore.doc(path);
    docRef.update(values).catch(this.handleDelayedError);
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
