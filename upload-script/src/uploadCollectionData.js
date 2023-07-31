import {cert, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

import serviceAccount from "./auth/serviceAccountKey.json" assert {type: "json"}, deprecatedAssertSyntax: true;
// import collection from "./__tests__/Encounter.json";

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();
const batch = db.batch();

function uploadCollectionData(collectionPath, collection) {

    collection.forEach((proj) => {
        const docRef = db.collection(collectionPath).doc();
        batch.set(docRef, {collectionJson: collection});
    });

    batch.commit();
    return;
}

export {uploadCollectionData};