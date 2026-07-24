import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import queryCollectionByTimeRange from "../queryCollectionByTimeRange.js";
import querySubcollectionByDocPath from "../querySubcollectionByDocPath.js";
import { parse } from "date-fns";
import collectionData from "../__fixtures__/collectionData.js";
import subCollectionData from "../__fixtures__/subCollectionData.js";

describe("querySubcollectionByDocPath", () => {
  const projectId = "project-id";
  const uid = "testId";
  const DATE_FORMAT = "dd/MM/yyyy";
  const TIMESTAMP_FIELD_NAME = "date";
  const collectionName = "collection";
  const subCollectionName = "subcollection";
  let testEnv;
  let firestoreEmulator;
  let collectionEntries;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: { host: "127.0.0.1", port: 8080 },
    });
    firestoreEmulator = testEnv.authenticatedContext(uid).firestore();

    for (const collectionEntry of collectionData) {
      const documentRef = firestoreEmulator
        .collection(collectionName)
        .doc(collectionEntry.id);

      documentRef.set(collectionEntry.data);

      for (const subCollectionEntry of subCollectionData) {
        await firestoreEmulator
          .doc(documentRef.path)
          .collection(subCollectionName)
          .doc(subCollectionEntry.id)
          .set({ ...subCollectionEntry.data, parentPath: documentRef.path });
      }
    }

    const startDate = parse("10/05/2020", DATE_FORMAT, new Date());
    const endDate = parse("28/06/2020", DATE_FORMAT, new Date());

    collectionEntries = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName
    );
  });

  afterAll(async () => {
    await testEnv.clearFirestore();
    await testEnv.cleanup();
  });

  it("adds a correct path to the querying result", async () => {
    const resultCollectionEntry = collectionEntries.find((r) => r.seqNo === 1);

    const subCollectionEntries = await querySubcollectionByDocPath(
      firestoreEmulator,
      resultCollectionEntry.path,
      subCollectionName
    );

    const resultSubCollectionEntry = subCollectionEntries.find(
      (r) => r.noOfAnimals === 1
    );

    expect(resultSubCollectionEntry.path).toBe(
      `${resultCollectionEntry.path}/${subCollectionName}/4`
    );
  });

  it("returns subcollection items given a correct collection document ID", async () => {
    const subCollectionEntries = await querySubcollectionByDocPath(
      firestoreEmulator,
      collectionEntries[0].path,
      subCollectionName
    );

    expect(subCollectionEntries.length).toEqual(3);
    const resultNoOfAnimals = subCollectionEntries.map((r) => r.noOfAnimals);
    expect(resultNoOfAnimals).toContain(1);
    expect(resultNoOfAnimals).toContain(2);
    expect(resultNoOfAnimals).toContain(5);
  });

  it("returns an empty array when no entries are found for a given id", async () => {
    const inexistentDocumentPath = "abc/123";
    const subCollectionEntries = await querySubcollectionByDocPath(
      firestoreEmulator,
      inexistentDocumentPath,
      subCollectionName
    );

    expect(subCollectionEntries).toEqual([]);
  });
});
