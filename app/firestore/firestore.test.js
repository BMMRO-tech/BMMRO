const firebase = require("@firebase/testing");
const fs = require("fs");
const numericFields = require("../src/forms/habitatUse/testCases/numericFields.json");
const textFields = require("../src/forms/habitatUse/testCases/textFields.json");
const dateFields = require("../src/forms/habitatUse/testCases/dateFields.json");
const timeFields = require("../src/forms/habitatUse/testCases/timeFields.json");
const selectFields = require("../src/forms/habitatUse/testCases/selectFields.json");
const hiddenFields = require("../src/forms/habitatUse/testCases/hiddenFields");

const projectId = "bmmro-app";
const rules = fs.readFileSync(`${__dirname}/firestore.rules`, "utf8");

describe("Habitat Use Collection Create Validation", () => {
  let db;
  const collectionName = "habitatUse";

  beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
    db = firebase
      .initializeTestApp({ projectId, auth: { uid: "testId" } })
      .firestore();
  });

  afterAll(async () => {
    await firebase.clearFirestoreData({ projectId });
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  const defaultValues = {
    encSeqNo: 1,
    numberOfAnimals: 1,
    numberOfCalves: 1,
    numberOfBoats: 1,
    waterDepth: 1,
    distance: 1,
    bearing: 1,
    aspect: 1,
    waterTemp: 16,
    surfaceBout: 1,
    latitude: "1.123456",
    longitude: "1.123456",
    groupComposition: "SM",
    comments: "",
    date: "23/07/2018",
    startTime: "22:22",
    endTime: "23:10",
    species: "Bottlenose dolphin - coastal",
    directionOfTravel: "N",
    bottomSubstrate: "Rock",
    cloudCover: "< 25%",
    beaufortSeaState: "0",
    tideState: "High",
    behaviour: "Rest",
    swellWaveHeight: "0",
    groupCohesion: "Tight",
    timestamp: new Date("2018-07-23T22:22"),
  };

  const testDocumentCreation = (testDescription, testCase, field) => {
    it(testDescription, async () => {
      if (testCase.error) {
        await firebase.assertFails(
          db.collection(collectionName).add({
            ...defaultValues,
            [field.id]: testCase.value,
          })
        );
      } else {
        await firebase.assertSucceeds(
          db.collection(collectionName).add({
            ...defaultValues,
            [field.id]: testCase.value,
          })
        );
      }
    });
  };

  const testDocCreationWithMissingField = (field) => {
    it("Should fail if field is missing", async () => {
      const testVal = { ...defaultValues };
      delete testVal[field.id];
      await firebase.assertFails(db.collection(collectionName).add(testVal));
    });
  };

  describe("Numeric fields", () => {
    numericFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          let testDescription;
          if (!!testCase.error) {
            testDescription = `Should fail due to '${testCase.error}' for value '${testCase.value}'`;
          } else if (testCase.value == "") {
            testDescription = `Should fail due to '${testCase.error}' for incorrect format`;
          } else {
            testDescription = `Should succeed with value '${testCase.value}'`;
          }

          testDocumentCreation(testDescription, testCase, field);
        });

        testDocCreationWithMissingField(field);
      });
    });
  });

  describe("Text fields", () => {
    textFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          let testDescription;
          if (!!testCase.error) {
            testDescription = `Should fail due to '${testCase.error}' for value of length ${testCase.value.length}`;
          } else {
            testDescription = `Should succeed with value of length ${testCase.value.length}`;
          }

          testDocumentCreation(testDescription, testCase, field);
        });

        testDocCreationWithMissingField(field);
      });
    });
  });

  describe("Select fields", () => {
    selectFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          let testDescription;
          if (!!testCase.error) {
            testDescription = `Should fail due to '${testCase.error}' for value of length ${testCase.value.length}`;
          } else {
            testDescription = `Should succeed with value of length ${testCase.value.length}`;
          }

          testDocumentCreation(testDescription, testCase, field);
        });

        testDocCreationWithMissingField(field);
      });
    });
  });

  describe("Date fields", () => {
    dateFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          if (testCase.target === "frontend") {
            return;
          }

          let testDescription;
          if (!!testCase.error) {
            testDescription = `Should fail due to '${testCase.error}' for value '${testCase.value}'`;
          } else {
            testDescription = `Should succeed with value '${testCase.value}'`;
          }

          testDocumentCreation(testDescription, testCase, field);
        });

        testDocCreationWithMissingField(field);
      });
    });
  });

  describe("Time fields", () => {
    timeFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          if (testCase.target === "frontend") {
            return;
          }

          let testDescription;
          if (!!testCase.error) {
            testDescription = `Should fail due to '${testCase.error}' for value '${testCase.value}'`;
          } else {
            testDescription = `Should succeed with value '${testCase.value}'`;
          }

          testDocumentCreation(testDescription, testCase, field);
        });

        testDocCreationWithMissingField(field);
      });
    });
  });

  describe("Hidden fields", () => {
    hiddenFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          let testDescription;
          if (!!testCase.error) {
            testDescription = `Should fail due to '${testCase.error}' for value ${testCase.value}`;
          } else {
            testDescription = `Should succeed with value ${testCase.value}`;
          }

          testDocumentCreation(testDescription, testCase, field);
        });

        testDocCreationWithMissingField(field);
      });
    });
  });
});
