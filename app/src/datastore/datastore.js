import firebase from "firebase";
import { COLLECTION_NAMES } from "./collectionNames";

export class Datastore {
  constructor(firestore) {
    this.firestore = firestore;
  }

  async createHabitatUse(values) {
    try {
      const result = await this.firestore
        .collection(COLLECTION_NAMES.habitatUse)
        .add(values);
      return result.id;
    } catch (e) {
      throw new Error("in createHabitatUse: " + e.message);
    }
  }

  listenForPendingHabitatUseRecords(saveRecords) {
    this.firestore
      .collection(COLLECTION_NAMES.habitatUse)
      .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
        const records = querySnapshot.docs
          .filter((doc) => doc.metadata.hasPendingWrites)
          .map((doc) => doc.data());
        saveRecords(records);
      });
  }
}

const config = {
  projectId: process.env.REACT_APP_PROJECT_ID,
};

const initFirestore = (config) => {
  firebase.initializeApp(config);
  const firestore = firebase.firestore();

  (async () => {
    try {
      await firestore.enablePersistence();
      console.log("Firebase persitence enabled");
    } catch (err) {
      if (err.code === "failed-precondition") {
        console.log("Failed firestore preconditions");
      } else if (err.code === "unimplemented") {
        console.log("Firestore not supported");
      } else {
        console.log("Unknown error enabling firestore persitence");
      }
    }
  })();

  return firestore;
};

export const datastore = new Datastore(initFirestore(config));
