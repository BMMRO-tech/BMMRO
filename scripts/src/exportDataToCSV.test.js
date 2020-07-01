const firebaseTesting = require("@firebase/testing");
const firebase = require("firebase");
const fs = require("fs");
const { parse } = require("date-fns");

const { exportDataToCSV } = require("./exportDataToCSV");

describe("exportData script", () => {
  const DATE_FORMAT = "dd/MM/yyyy";

  const projectId = "project-id";
  const apiKey = "api-key";
  const authDomain = "auth-domain";
  const email = "test";
  const password = "test";

  let startDate;
  let endDate;

  describe("Export data to csv", () => {
    const collectionName = "habitatUse";

    let firebaseMock;
    let firestoreMock;

    beforeEach(() => {
      firebaseMock = firebaseTesting.initializeTestApp({
        projectId,
        auth: { uid: "testId" },
      });

      firestoreMock = firebaseMock.firestore();

      jest
        .spyOn(firebase, "initializeApp")
        .mockImplementationOnce(() => jest.fn());

      jest.spyOn(firebase, "auth").mockImplementationOnce(() => ({
        signInWithEmailAndPassword: jest.fn(),
      }));

      jest
        .spyOn(firebase, "firestore")
        .mockImplementationOnce(() => firestoreMock);

      jest.spyOn(fs, "existsSync").mockImplementation(() => {});
      jest.spyOn(fs, "mkdirSync").mockImplementation(() => {});

      const testEntries = [
        {
          numberOfAnimals: 1,
          timestamp: new Date("2020-05-23"),
        },
        {
          numberOfAnimals: 2,
          timestamp: new Date("2020-06-23"),
        },
        {
          numberOfAnimals: 5,
          timestamp: new Date("2020-03-20"),
        },
      ];

      testEntries.forEach((entry) => {
        firestoreMock.collection(collectionName).add({
          ...entry,
        });
      });
    });

    afterEach(async () => {
      await firebaseTesting.clearFirestoreData({ projectId });
      await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
      jest.clearAllMocks();
    });

    it("should filter entries with given time range", async () => {
      startDate = parse("10/05/2020", DATE_FORMAT, new Date());
      endDate = parse("28/06/2020", DATE_FORMAT, new Date());

      let actual;
      const expected = [
        '"numberOfAnimals","timestamp"',
        '1,"{""seconds"":1590192000,""nanoseconds"":0}"',
        '2,"{""seconds"":1592870400,""nanoseconds"":0}"',
      ];

      jest
        .spyOn(fs, "writeFile")
        .mockImplementation((path, data) => (actual = data.split("\n")));

      await exportDataToCSV(
        projectId,
        apiKey,
        authDomain,
        email,
        password,
        startDate,
        endDate
      );
      expect(actual).toEqual(expected);
    });

    it("should include entries on start date and exclude entries on end date", async () => {
      startDate = parse("23/05/2020", DATE_FORMAT, new Date());
      endDate = parse("23/06/2020", DATE_FORMAT, new Date());

      let actual;
      const expected = [
        '"numberOfAnimals","timestamp"',
        '1,"{""seconds"":1590192000,""nanoseconds"":0}"',
      ];

      jest
        .spyOn(fs, "writeFile")
        .mockImplementation((path, data) => (actual = data.split("\n")));

      await exportDataToCSV(
        projectId,
        apiKey,
        authDomain,
        email,
        password,
        startDate,
        endDate
      );
      expect(actual).toEqual(expected);
    });

    it("should throw an error if there are no entries within given time range", async () => {
      startDate = parse("10/02/2020", DATE_FORMAT, new Date());
      endDate = parse("28/02/2020", DATE_FORMAT, new Date());

      await expect(
        exportDataToCSV(
          projectId,
          apiKey,
          authDomain,
          email,
          password,
          startDate,
          endDate
        )
      ).rejects.toThrow(/there are no entries within given time range/i);
    });
  });
});
