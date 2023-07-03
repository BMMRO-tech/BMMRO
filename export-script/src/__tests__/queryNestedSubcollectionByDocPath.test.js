const firebaseTesting = require("@firebase/testing");
const queryCollectionByTimeRange = require("../queryCollectionByTimeRange");
const querySubcollectionByDocPath = require("../querySubcollectionByDocPath");
const { parse } = require("date-fns");
const collectionData = require("../__fixtures__/collectionData");
const subCollectionData = require("../__fixtures__/subCollectionData");
const nestedSubcollectionData = require("../__fixtures__/nestedSubcollectionData");
const queryNestedSubcollectionByDocPath = require("../queryNestedSubcollectionByDocPath");

describe("queryNestedSubcollectionByDocPath", () => {
  const projectId = "project-id";
  const uid = "testId";
  const DATE_FORMAT = "dd/MM/yyyy";
  const TIMESTAMP_FIELD_NAME = "date";
  const collectionName = "collection";
  const subCollectionName = "subcollection";
  const nestedSubcollectionName = "nestedSubCollection";
  let firestoreEmulator;
  let collectionEntries;

  beforeAll(async () => {
    const firebaseMock = firebaseTesting.initializeTestApp({
      projectId,
      auth: { uid },
    });
    firestoreEmulator = firebaseMock.firestore();

    for (const collectionEntry of collectionData) {
      const documentRef = firestoreEmulator
        .collection(collectionName)
        .doc(collectionEntry.id);

        documentRef.set(collectionEntry.data);
    
        for (const subCollectionEntry of subCollectionData){
            const subCollectionDocumentRef = documentRef
                .collection(subCollectionName)
                .doc(subCollectionEntry.id)


              

                subCollectionDocumentRef.set(subCollectionEntry.data);


                for (const nestedSubcollectionEntry of nestedSubcollectionData){
                  await firestoreEmulator
                  .doc(documentRef.path)
                  .collection(subCollectionName)
                  .doc(subCollectionEntry.id)
                  .collection(nestedSubcollectionName)
                  .doc(nestedSubcollectionEntry.id)
                  .set({ ...nestedSubcollectionEntry.data, parentPath: subCollectionDocumentRef.path });
                }   
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
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
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

    const nestedSubCollectionEntries = await queryNestedSubcollectionByDocPath(
        firestoreEmulator,
        resultSubCollectionEntry.path,
        subCollectionName,
        nestedSubcollectionName
    )

    const resultNestedSubcollectionEntry = nestedSubCollectionEntries.find(
        (r) => r.noOfAnimals === 7
    )

    expect(resultNestedSubcollectionEntry.path).toBe(
      `${resultCollectionEntry.path}/${subCollectionName}/4/${nestedSubcollectionName}/7`
    );
  });

  it("returns nested subcollection items given a correct collection document ID and correct subCollection document ID", async () => {
    const subCollectionEntries = await querySubcollectionByDocPath(
      firestoreEmulator,
      collectionEntries[0].path,
      subCollectionName
    );

    const nestedSubcollectionEntries = await queryNestedSubcollectionByDocPath(
        firestoreEmulator,
        subCollectionEntries[0].path,
        subCollectionName,
        nestedSubcollectionName
    )

    expect(nestedSubcollectionEntries.length).toEqual(3);
    const resultNoOfAnimals = nestedSubcollectionEntries.map((r) => r.noOfAnimals);
    expect(resultNoOfAnimals).toContain(7);
    expect(resultNoOfAnimals).toContain(8);
    expect(resultNoOfAnimals).toContain(9);
  });

  it("returns an empty array when no entries are found for a given id", async () => {
    const inexistentDocumentPath = "abc/123/def/456";
    const nestedSubcollectionEntries = await queryNestedSubcollectionByDocPath(
      firestoreEmulator,
      inexistentDocumentPath,
      subCollectionName,
      nestedSubcollectionName
    );

    expect(nestedSubcollectionEntries).toEqual([]);
  });
});