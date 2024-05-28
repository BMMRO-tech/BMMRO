const firebaseTesting = require("@firebase/rules-unit-testing");
const queryCollectionByTimeRange = require("../queryCollectionByTimeRange");
const { parse } = require("date-fns");
const collectionData = require("../__fixtures__/collectionData");
const collectionDataWithMixedExportStatus = require("../__fixtures__/collectionDataWithMixedExportStatus");

describe("queryCollectionByTimeRange", () => {
  const projectId = "project-id";
  const uid = "testId";
  const DATE_FORMAT = "dd/MM/yyyy";
  const TIMESTAMP_FIELD_NAME = "date";
  const collectionName = "collection";
  let firestoreEmulator;

  const addToDb = async (data) => {
    for (const entry of data) {
      await firestoreEmulator
        .collection(collectionName)
        .doc(entry.id)
        .set(entry.data);
    }
  };

  beforeAll(async () => {
    const firebaseMock = firebaseTesting.initializeTestApp({
      projectId,
      auth: { uid },
    });
    firestoreEmulator = firebaseMock.firestore();
  });

  afterEach(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("adds a correct path to the querying result", async () => {
    await addToDb(collectionData);
    const startDate = parse("22/05/2020", DATE_FORMAT, new Date());
    const endDate = parse("24/05/2020", DATE_FORMAT, new Date());

    const collectionEntries = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName,
      false
    );

    expect(collectionEntries[0].path).toBe(`${collectionName}/1`);
  });

  it("filters entries with given time range", async () => {
    await addToDb(collectionData);
    const startDate = parse("10/05/2020", DATE_FORMAT, new Date());
    const endDate = parse("28/06/2020", DATE_FORMAT, new Date());

    const collectionEntries = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName,
      false
    );

    expect(collectionEntries.length).toEqual(2);
    const resultSequenceNumbers = collectionEntries.map((r) => r.seqNo);
    expect(resultSequenceNumbers).toContain(1);
    expect(resultSequenceNumbers).toContain(2);
    expect(resultSequenceNumbers).not.toContain(5);
  });

  it("includes entries on start date and excludes entries on end date", async () => {
    await addToDb(collectionData);
    startDate = parse("23/05/2020", DATE_FORMAT, new Date());
    endDate = parse("23/06/2020", DATE_FORMAT, new Date());

    const collectionEntries = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName,
      false
    );

    expect(collectionEntries.length).toEqual(1);
    const resultSequenceNumbers = collectionEntries.map((r) => r.seqNo);
    expect(resultSequenceNumbers).toContain(1);
    expect(resultSequenceNumbers).not.toContain(2);
  });

  it("returns an empty array when no entries fall within time range", async () => {
    await addToDb(collectionData);
    startDate = parse("10/02/2020", DATE_FORMAT, new Date());
    endDate = parse("28/02/2020", DATE_FORMAT, new Date());

    const collectionEntries = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName,
      false
    );

    expect(collectionEntries).toEqual([]);
  });

  it("has an option to query only for entries that haven't yet been exported", async () => {
    await addToDb(collectionDataWithMixedExportStatus);
    const startDate = parse("01/01/2010", DATE_FORMAT, new Date());
    const endDate = parse("31/12/2050", DATE_FORMAT, new Date());

    const collectionEntries = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName,
      true
    );

    expect(collectionEntries.length).toEqual(2);
    const resultSequenceNumbers = collectionEntries.map((r) => r.seqNo);
    expect(resultSequenceNumbers).toContain(2);
    expect(resultSequenceNumbers).toContain(5);
    expect(resultSequenceNumbers).not.toContain(1);
  });
});
