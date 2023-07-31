import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./../auth/serviceAccountKey.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const batch = db.batch();

function uploadCollectionData(collectionPath, collection) {

  collection.forEach((record) => {
    const docRef = db.collection(collectionPath).doc();
    batch.set(docRef, record );
  });

  batch.commit();
  return;
}

export default uploadCollectionData ;
