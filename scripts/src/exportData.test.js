const firebaseTesting = require("@firebase/testing");
const firebase = require("firebase");
const fs = require("fs");

const { exportDataToCSV } = require("./exportData");

describe("exportData script", () => {
  const projectId = "test";

  describe("Check environment variables", () => {
    beforeEach(() => {
      delete process.env.PROJECT_ID;
      delete process.env.API_KEY;
      delete process.env.AUTH_DOMAIN;
      delete process.env.USERNAME;
      delete process.env.PASSWORD;
    });

    it("should throw error if environment variables are not set", async () => {
      await expect(exportDataToCSV).rejects.toThrow(/missing env variable/i);
    });
  });

  describe("Check script arguments", () => {
    beforeEach(() => {
      process.env.PROJECT_ID = "project-id";
      process.env.API_KEY = "api-key";
      process.env.AUTH_DOMAIN = "auth-domain";
      process.env.USERNAME = "test";
      process.env.PASSWORD = "test";

      jest.spyOn(firebase, "initializeApp").mockImplementation(() => {
        firebaseTesting.initializeTestApp({
          projectId,
          auth: { uid: "testId" },
        });
      });

      jest.spyOn(firebase, "auth").mockImplementation(() => ({
        signInWithEmailAndPassword: jest.fn(),
      }));

      jest.spyOn(firebase, "firestore").mockImplementation(() => {});
    });

    afterEach(async () => {
      delete process.env.PROJECT_ID;
      delete process.env.API_KEY;
      delete process.env.AUTH_DOMAIN;
      delete process.env.USERNAME;
      delete process.env.PASSWORD;
      delete process.argv[2];
      delete process.argv[3];

      await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
    });

    it("should throw error if arguments are not set", async () => {
      await expect(exportDataToCSV).rejects.toThrow(/missing script argument/i);
    });

    it("should throw error if dates in arguments are in the wrong format", async () => {
      process.argv[2] = "2020-01-10";
      process.argv[3] = "10/02/2020";

      await expect(exportDataToCSV).rejects.toThrow(
        /dates must be in format dd\/mm\/yyyy/i
      );
    });

    it("should throw error if end date is before start date", async () => {
      process.argv[2] = "10/02/2020";
      process.argv[3] = "10/01/2020";

      await expect(exportDataToCSV).rejects.toThrow(
        /end date must be after start date/i
      );
    });
  });

  describe("Export data to csv", () => {
    const collectionName = "habitatUse";

    let firebaseMock;
    let firestoreMock;

    beforeEach(() => {
      process.env.PROJECT_ID = "test";
      process.env.API_KEY = "test";
      process.env.AUTH_DOMAIN = "test";
      process.env.USERNAME = "test@test.com";
      process.env.PASSWORD = "test";

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
      delete process.env.PROJECT_ID;
      delete process.env.API_KEY;
      delete process.env.AUTH_DOMAIN;
      delete process.env.USERNAME;
      delete process.env.PASSWORD;
      delete process.argv[2];
      delete process.argv[3];

      await firebaseTesting.clearFirestoreData({ projectId });
      await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
      jest.clearAllMocks();
    });

    it("should filter entries with given time range", async () => {
      process.argv[2] = "10/05/2020";
      process.argv[3] = "28/06/2020";

      let actual;
      const expected = [
        '"numberOfAnimals","timestamp"',
        '1,"{""seconds"":1590192000,""nanoseconds"":0}"',
        '2,"{""seconds"":1592870400,""nanoseconds"":0}"',
      ];

      jest
        .spyOn(fs, "writeFile")
        .mockImplementation((path, data) => (actual = data.split("\n")));

      await exportDataToCSV();
      expect(actual).toEqual(expected);
    });

    it("should include entries on start date and exclude entries on end date", async () => {
      process.argv[2] = "23/05/2020";
      process.argv[3] = "23/06/2020";

      let actual;
      const expected = [
        '"numberOfAnimals","timestamp"',
        '1,"{""seconds"":1590192000,""nanoseconds"":0}"',
      ];

      jest
        .spyOn(fs, "writeFile")
        .mockImplementation((path, data) => (actual = data.split("\n")));

      await exportDataToCSV();
      expect(actual).toEqual(expected);
    });

    it("should throw an error if there are no entries within given time range", async () => {
      process.argv[2] = "10/02/2020";
      process.argv[3] = "28/02/2020";

      await expect(exportDataToCSV).rejects.toThrow(
        /there are no entries within given time range/i
      );
    });
  });
});
