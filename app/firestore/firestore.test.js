const firebase = require("@firebase/testing");
const fs = require("fs");

const projectId = "bmmro-app";
const rules = fs.readFileSync(`${__dirname}/firestore.rules`, "utf8");

describe("Habitat Use Collection Validation", () => {
  let db;

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

  describe("numberOfAnimals", () => {
    it("should accept value between 0 and 360 ", async () => {
      await firebase.assertSucceeds(
        db.collection("habitatUse").add({ numberOfAnimals: 1 })
      );
    });

    it("should not accept value lower than 0", async () => {
      await firebase.assertFails(
        db.collection("habitatUse").add({ numberOfAnimals: -1 })
      );
    });

    it("should only accept number", async () => {
      await firebase.assertFails(
        db.collection("habitatUse").add({ numberOfAnimals: "test text" })
      );
    });
  });
});
