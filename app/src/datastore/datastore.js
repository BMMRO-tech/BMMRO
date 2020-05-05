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
}

const config = {
  projectId: process.env.REACT_APP_PROJECT_ID
};

const initFirestore = (config) => {
  firebase.initializeApp(config);
  return firebase.firestore();
};

export const datastore = new Datastore(initFirestore(config));
