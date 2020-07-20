const firebase = require("@firebase/testing");
const fs = require("fs");

const projectId = "bmmro-app";
const rules = fs.readFileSync(`${__dirname}/firestore.rules`, "utf8");

describe("Habitat Use Collection", () => {
  let db;
  const collectionName = "habitatUse";

  afterAll(async () => {
    await firebase.clearFirestoreData({ projectId });
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  const defaultValues = {
    numberField: 1,
    textField: "Tight",
  };

  it("should successfully submit data when user is authenticated", async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
    db = firebase
      .initializeTestApp({ projectId, auth: { uid: "testId" } })
      .firestore();

    await firebase.assertSucceeds(
      db.collection(collectionName).add(defaultValues)
    );
  });

  it("should fail to submit data when user is not authenticated", async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
    db = firebase.initializeTestApp({ projectId }).firestore();

    await firebase.assertFails(
      db.collection(collectionName).add(defaultValues)
    );
  });
});

describe("Encounter collection with habitat use subcollection", () => {
  let db;
  const collectionName = "encounter";
  const subcollectionName = "habitatUseTest";

  const initializeFirestore = (auth) => {
    return firebase.initializeTestApp({ projectId, auth }).firestore();
  };

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId });
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  beforeEach(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  const defaultValues = {
    numberField: 1,
    textField: "Tight",
  };

  describe("Encounter collection", () => {
    it("should successfully submit data when user is authenticated", async () => {
      db = initializeFirestore({ uid: "testId" });

      await firebase.assertSucceeds(
        db.collection(collectionName).add(defaultValues)
      );
    });

    it("should fail to submit data when user is not authenticated", async () => {
      db = initializeFirestore(null);

      await firebase.assertFails(
        db.collection(collectionName).add(defaultValues)
      );
    });
  });

  describe("Habitat use subcollection", () => {
    it("should successfully submit data when user is authenticated", async () => {
      db = initializeFirestore({ uid: "testId" });
      const { id } = await db.collection(collectionName).add(defaultValues);

      await firebase.assertSucceeds(
        db
          .collection(collectionName)
          .doc(id)
          .collection(subcollectionName)
          .add(defaultValues)
      );
    });

    it("should fail to submit data when user is not authenticated", async () => {
      db = initializeFirestore({ uid: "testId" });
      const { id } = await db.collection(collectionName).add(defaultValues);

      // Firebase emulator doesn't provide a way to sign the user out
      db = initializeFirestore(null);

      await firebase.assertFails(
        db
          .collection(collectionName)
          .doc(id)
          .collection(subcollectionName)
          .add(defaultValues)
      );
    });
  });
});
