const firebaseTesting = require("@firebase/testing");
const updateInBatch = require("../updateInBatch");
const collectionData = require("../__fixtures__/collectionData");
const subcollectionData = require("../__fixtures__/subCollectionData");

describe("updateInBatch", () => {
  const projectId = "project-id";
  const uid = "testId";
  const collectionName = "collection";
  const subcollectionName = "subcollection";
  let firestoreEmulator;

  beforeAll(async () => {
    const firebaseMock = firebaseTesting.initializeTestApp({
      projectId,
      auth: { uid },
    });
    firestoreEmulator = firebaseMock.firestore();
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
  afterEach(
    async () => await firebaseTesting.clearFirestoreData({ projectId })
  );
  afterAll(async () => {
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("updates doc only for the passed doc refs", async () => {
    await updateInBatch(firestoreEmulator, [{ path: `${collectionName}/1` }], {
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

  it("updates all docs for which doc refs are passed", async () => {
    await updateInBatch(
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
  });

  it("updates all docs by doc ref regardless of collection", async () => {
    await updateInBatch(
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
  });
});
