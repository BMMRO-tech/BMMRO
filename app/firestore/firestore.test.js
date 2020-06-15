const firebase = require("@firebase/testing");
const fs = require("fs");
const numericFields = require("../src/forms/habitatUse/testCases/numericFields.json");

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
    latitude: 1.123456,
    longitude: 1.123456,
  };

  describe("Numeric fields", () => {
    numericFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          let testDescription;
          if (!!testCase.error) {
            testDescription = `Should fail due to '${testCase.error}' for value '${testCase.value}'`;
          } else if (testCase.value == "") {
            testDescription = `Should fail due to '${testCase.error}' for empty value`;
          } else {
            testDescription = `Should succeed with value '${testCase.value}'`;
          }

          it(testDescription, async () => {
            const value = !!testCase.value
              ? parseFloat(testCase.value)
              : testCase.value;

            if (testCase.error) {
              await firebase.assertFails(
                db.collection(collectionName).add({
                  ...defaultValues,
                  [field.id]: value,
                })
              );
            } else {
              await firebase.assertSucceeds(
                db.collection(collectionName).add({
                  ...defaultValues,
                  [field.id]: value,
                })
              );
            }
          });
        });

        it("Should fail if property is missing", async () => {
          const testVal = { ...defaultValues };
          delete testVal[field.id];
          await firebase.assertFails(
            db.collection(collectionName).add(testVal)
          );
        });
      });
    });
  });
});
