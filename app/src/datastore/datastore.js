import firebase from "firebase";
import { COLLECTION_NAMES } from "./collectionNames";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

export class Datastore {
  constructor(datastore) {
    this.datastore = datastore;
  }

  recordHabitatUse(values) {
    return this.datastore.collection(COLLECTION_NAMES.habitatUse).add(values);
  }
}

const initFirestore = (config) => {
  firebase.initializeApp(config);
  return firebase.firestore();
};

export const datastore = new Datastore(initFirestore(config));
