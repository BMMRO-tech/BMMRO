import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import updateInBatch from "../updateInBatch.js";
import collectionData from "../__fixtures__/collectionData.js";
import subcollectionData from "../__fixtures__/subCollectionData.js";
import getMessage from "../constants/getMessage.js";

describe("updateInBatch", () => {
  const projectId = "project-id";
  const uid = "testId";
  const collectionName = "collection";
  const subcollectionName = "subcollection";
  let testEnv;
  let firestoreEmulator;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: { host: "127.0.0.1", port: 8080 },
    });
    firestoreEmulator = testEnv.authenticatedContext(uid).firestore();
  });

  beforeEach(async () => {
    for (const entry of collectionData) {
      await firestoreEmulator
        .collection(collectionName)
        .doc(entry.id)
        .set(entry.data);
    }
    const subdoc = subcollectionData[0];
    await firestoreEmulator
      .doc(`${collectionName}/1`)
      .collection(subcollectionName)
      .doc(subdoc.id)
      .set(subdoc.data);
  });

  afterEach(async () => await testEnv.clearFirestore());

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("updates doc only for the passed doc refs", async () => {
    const status = await updateInBatch(
      firestoreEmulator,
      [{ path: `${collectionName}/1` }],
      {
        exported: true,
      }
    );

    const collectionEntries = [];
    const result = await firestoreEmulator.collection(collectionName).get();
    result.forEach((doc) => {
      collectionEntries.push(doc.data());
    });

    const updatedEntry = collectionEntries.find((r) => r.seqNo === 1);
    const skippedEntry = collectionEntries.find((r) => r.seqNo === 2);

    expect(updatedEntry).toHaveProperty("exported", true);
    expect(skippedEntry).toHaveProperty("exported", false);
    expect(status.isSuccessful()).toBe(true);
  });

  it("updates all docs for which doc refs are passed", async () => {
    const status = await updateInBatch(
      firestoreEmulator,
      [{ path: `${collectionName}/1` }, { path: `${collectionName}/2` }],
      { exported: true }
    );

    const collectionEntries = [];
    (await firestoreEmulator.collection(collectionName).get()).forEach((doc) =>
      collectionEntries.push(doc.data())
    );
    const updatedEntries = collectionEntries.filter((entry) => entry.exported);

    expect(updatedEntries).toHaveLength(2);
    expect(updatedEntries).toContainEqual({
      seqNo: 1,
      date: expect.anything(),
      exported: true,
    });
    expect(updatedEntries).toContainEqual({
      seqNo: 2,
      date: expect.anything(),
      exported: true,
    });
    expect(status.isSuccessful()).toBe(true);
  });

  it("updates all docs by doc ref regardless of collection", async () => {
    const status = await updateInBatch(
      firestoreEmulator,
      [
        { path: `${collectionName}/1` },
        { path: `${collectionName}/1/${subcollectionName}/4` },
      ],
      { exported: true }
    );

    const allEntries = [];
    (await firestoreEmulator.collection(collectionName).get()).forEach((doc) =>
      allEntries.push(doc.data())
    );
    (
      await firestoreEmulator
        .doc(`${collectionName}/1`)
        .collection(subcollectionName)
        .get()
    ).forEach((doc) => allEntries.push(doc.data()));

    const updatedEntries = allEntries.filter((entry) => entry.exported);

    expect(updatedEntries).toHaveLength(2);
    expect(updatedEntries).toContainEqual({
      seqNo: 1,
      date: expect.anything(),
      exported: true,
    });
    expect(updatedEntries).toContainEqual({
      noOfAnimals: 1,
      exported: true,
    });
    expect(status.isSuccessful()).toBe(true);
  });

  it("does not update any docs if something goes wrong", async () => {
    const nonExistentPath = "mango";
    const status = await updateInBatch(
      firestoreEmulator,
      [{ path: `${collectionName}/1` }, { path: `${nonExistentPath}/123` }],
      { exported: true }
    );

    const collectionEntries = [];
    (await firestoreEmulator.collection(collectionName).get()).forEach((doc) =>
      collectionEntries.push(doc.data())
    );
    const updatedEntries = collectionEntries.filter((entry) => entry.exported);

    expect(updatedEntries).toHaveLength(0);
    expect(status.isSuccessful()).toBe(false);
    expect(status.status).toBe("BATCH_UPDATE_FAILED");
    expect(status.value).toBe(getMessage("BATCH_UPDATE_FAILED"));
  });
});
