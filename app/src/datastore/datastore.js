import "firebase/firestore";
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

  async readDocByPath(path) {
    try {
      const docRef = this.firestore.doc(path);
      const docSnapshot = await docRef.get();
      return { data: docSnapshot.data(), path: docRef.path };
    } catch (e) {
      this.enableLogging && console.error(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  async readDocsByParentPath(parentPath, subcollectionName) {
    try {
      const docRefs = await this.firestore
        .doc(parentPath)
        .collection(subcollectionName)
        .get();

      const results = [];
      docRefs.forEach((doc) =>
        results.push({ data: doc.data(), path: doc.ref.path })
      );
      return results;
    } catch (e) {
      this.enableLogging && console.error(e);
      throw new DatastoreError(DatastoreErrorType.COLLECTION_READ);
    }
  }

  createDoc(collectionPath, values) {
    const docRef = this.firestore.collection(collectionPath).doc();
    docRef.set(values).catch(this.handleDelayedError);
    return docRef.path;
  }

  createSubDoc(parentPath, subcollectionName, values) {
    return this.createDoc(`${parentPath}/${subcollectionName}`, values);
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
