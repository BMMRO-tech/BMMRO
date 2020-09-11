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

  disableNetworkIfOffline() {
    if (!window.navigator.onLine) {
      this.firestore.disableNetwork();
    }

    window.addEventListener("offline", () => {
      this.firestore.disableNetwork();
    });

    window.addEventListener("online", () => {
      this.firestore.enableNetwork();
    });
  }

  convertTimeObjectToDate(docData) {
    for (const property in docData) {
      const value = docData[property];
      const isTimeObject = typeof value === "object" && "seconds" in value;

      if (isTimeObject) {
        const date = fromUnixTime(value.seconds);
        docData[property] = date;
      }
    }
  }

  async readDocByPath(path) {
    try {
      const docRef = this.firestore.doc(path);
      const docSnapshot = await docRef.get();
      const docData = docSnapshot.data();

      this.convertTimeObjectToDate(docData);

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
      docsSnapshots.forEach((doc) => {
        const docData = doc.data();

        this.convertTimeObjectToDate(docData);

        results.push({ data: docData, id: doc.id });
      });
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
        .get();

      const results = [];
      docsSnapshots.forEach((doc) => {
        const docData = doc.data();

        this.convertTimeObjectToDate(docData);

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

  subscribeToPendingRecords(
    collectionName,
    subcollectionName,
    hasPendingCallback
  ) {
    let collectionPending = false;
    let subcollectionPending = false;
    const snapshotSettings = {
      includeMetadataChanges: true,
    };

    this.firestore
      .collection(collectionName)
      .where("exported", "==", false)
      .onSnapshot(
        snapshotSettings,
        (querySnapshot) => {
          if (querySnapshot.docChanges(snapshotSettings).length !== 0) {
            if (querySnapshot.metadata.hasPendingWrites) {
              collectionPending = true;
              hasPendingCallback(true);
            } else {
              collectionPending = false;
              hasPendingCallback(subcollectionPending);
            }
          }
        },
        (e) => {
          console.log("Error for ", collectionName, " -- ", e);
        }
      );

    this.firestore
      .collectionGroup(subcollectionName)
      .where("exported", "==", false)
      .onSnapshot(
        snapshotSettings,
        (querySnapshot) => {
          if (querySnapshot.docChanges(snapshotSettings).length !== 0) {
            if (querySnapshot.metadata.hasPendingWrites) {
              subcollectionPending = true;
              hasPendingCallback(true);
            } else {
              subcollectionPending = false;
              hasPendingCallback(collectionPending);
            }
          }
        },
        (e) => {
          console.log("Error for ", subcollectionName, " -- ", e);
        }
      );
  }
}

export const initFirestore = (firebase) => {
  try {
    return firebase.firestore();
  } catch (e) {
    throw new DatastoreError(DatastoreErrorType.INITIALIZATION);
  }
};
