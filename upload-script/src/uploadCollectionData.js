import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./../auth/serviceAccountKey.json" assert { type: "json" };
import fs from "fs";

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const batch = db.batch();
const encounterPath = "/encounter";
const habitatPath = "/habitatUse";

function uploadData(
  encounterJson,
  habitatJson,
  biopsyJson,
  encounterSpecimenJson
) {
  encounterJson.forEach((record) => {
    const docRef = db.collection(encounterPath).doc();
    let encounterTimestamp = record.startTimestamp;
    record.startTimestamp = new Date(record.startTimestamp * 1000);
    batch.set(docRef, record);
    habitatJson.forEach((habitat) => {
      if (
        encounterTimestamp === habitat.date &&
        record.area === habitat.area &&
        record.sequenceNumber === habitat.encSeqNo
      ) {
        delete habitat["date"];
        docRef.collection("habitatUse").doc().set(habitat);
      }
    });
    biopsyJson.forEach((biopsy) => {
      if (
        encounterTimestamp === biopsy.dateTaken &&
        record.area === biopsy.area &&
        record.sequenceNumber === biopsy.encSeqNo
      ) {
        biopsy.dateTaken = new Date(biopsy.dateTaken * 1000);
        biopsy.species = record.species;
        let biopsyDocRef = docRef.collection("biopsy").doc();
        biopsyDocRef.set(biopsy);
        encounterSpecimenJson.forEach((specimen) => {
          if (
            encounterTimestamp === specimen.dateTaken &&
            record.area === specimen.area &&
            record.sequenceNumber === specimen.encSeqNo
          ) {
            specimen.dateTaken = new Date(specimen.dateTaken * 1000);
            biopsyDocRef.collection("specimen").doc().set(specimen);
          }
        });
      }
    });
  });

  batch.commit();
  return;
}

function uploadCollectionData() {
  const path = process.cwd();
  const encounterBuffer = fs.readFileSync(
    path + "/src/__tests__/data/Encounter_test.json"
  );
  const habitatData = fs.readFileSync(
    path + "/src/__tests__/data/habitat_test.json"
  );
  const biopsy = fs.readFileSync(path + "/src/__tests__/data/biopsy_test.json");

  const specimen = fs.readFileSync(
    path + "/src/__tests__/data/specimen_test.json"
  );
  const encounterJson = JSON.parse(encounterBuffer.toString());
  const habitatJson = JSON.parse(habitatData.toString());
  const biopsyJson = JSON.parse(biopsy.toString());
  const encounterSpecimen = JSON.parse(specimen.toString());

  uploadData(encounterJson, habitatJson, biopsyJson, encounterSpecimen);
}

export default uploadCollectionData;
