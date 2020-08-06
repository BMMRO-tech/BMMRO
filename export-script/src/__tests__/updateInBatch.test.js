const firebaseTesting = require("@firebase/testing");
const updateInBatch = require("../updateInBatch");
const collectionData = require("../__fixtures__/collectionData");

describe("updateInBatch", () => {
  const projectId = "project-id";
  const uid = "testId";
  const collectionName = "collection";
  let firestoreEmulator;

  beforeAll(async () => {
    const firebaseMock = firebaseTesting.initializeTestApp({
      projectId,
      auth: { uid },
    });
    firestoreEmulator = firebaseMock.firestore();

    for (const entry of collectionData) {
      await firestoreEmulator
        .collection(collectionName)
        .doc(entry.id)
        .set(entry.data);
    }
  });

  afterAll(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("updates doc given one entry", async () => {
    await updateInBatch(firestoreEmulator, [{ path: "collection/1" }], {
      exported: true,
    });

    const collectionEntries = [];
    const result = await firestoreEmulator.collection(collectionName).get();
    result.forEach((doc) => {
      collectionEntries.push(doc.data());
    });

    const updatedEntry = collectionEntries.find((r) => r.seqNo === 1);
    const skippedEntry = collectionEntries.find((r) => r.seqNo === 2);

    expect(updatedEntry).toHaveProperty("exported", true);
    expect(skippedEntry).toHaveProperty("exported", false);
  });
});
