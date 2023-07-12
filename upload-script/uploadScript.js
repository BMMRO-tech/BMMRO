import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "./auth/serviceAccountKey.json" assert { type: "json" };
import project from "./project.js";

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const batch = db.batch();

project.forEach((proj) => {
  const docRef = db.collection("project").doc();
  batch.set(docRef, { projectName: proj });
});

batch.commit();
