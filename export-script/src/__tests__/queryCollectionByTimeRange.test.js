const firebaseTesting = require("@firebase/testing");
const queryCollectionByTimeRange = require("../queryCollectionByTimeRange");
const { parse } = require("date-fns");
const testEntries = require("../__fixtures__/encounterData");

describe("queryCollectionByTimeRange", () => {
  const projectId = "project-id";
  const uid = "testId";
  const DATE_FORMAT = "dd/MM/yyyy";
  const TIMESTAMP_FIELD_NAME = "date";
  const collectionName = "encounter";
  let firestoreEmulator;

  beforeAll(async () => {
    const firebaseMock = firebaseTesting.initializeTestApp({
      projectId,
      auth: { uid },
    });
    firestoreEmulator = firebaseMock.firestore();

    for (const entry of testEntries) {
      await firestoreEmulator.collection(collectionName).add(entry);
    }
  });

  afterAll(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("filters entries with given time range", async () => {
    const startDate = parse("10/05/2020", DATE_FORMAT, new Date());
    const endDate = parse("28/06/2020", DATE_FORMAT, new Date());

    const results = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName
    );

    expect(results.length).toEqual(2);
    const resultSequenceNumbers = results.map((r) => r.seqNo);
    expect(resultSequenceNumbers).toContain(1);
    expect(resultSequenceNumbers).toContain(2);
    expect(resultSequenceNumbers).not.toContain(5);
  });

  it("includes entries on start date and excludes entries on end date", async () => {
    startDate = parse("23/05/2020", DATE_FORMAT, new Date());
    endDate = parse("23/06/2020", DATE_FORMAT, new Date());

    const results = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName
    );

    expect(results.length).toEqual(1);
    const resultSequenceNumbers = results.map((r) => r.seqNo);
    expect(resultSequenceNumbers).toContain(1);
    expect(resultSequenceNumbers).not.toContain(2);
  });

  it("returns an empty array when no entries fall within time range", async () => {
    startDate = parse("10/02/2020", DATE_FORMAT, new Date());
    endDate = parse("28/02/2020", DATE_FORMAT, new Date());

    const results = await queryCollectionByTimeRange(
      startDate,
      endDate,
      TIMESTAMP_FIELD_NAME,
      firestoreEmulator,
      collectionName
    );

    expect(results).toEqual([]);
  });
});
