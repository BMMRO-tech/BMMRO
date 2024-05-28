const firebase = require("@firebase/rules-unit-testing");
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
  const habitatUseSubcollectionName = "habitatUse";
  const biopsySubcollectionName = "biopsy";
  const specimenSubcollectionName = "specimen";

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
          .collection(habitatUseSubcollectionName)
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
          .collection(habitatUseSubcollectionName)
          .add(defaultValues)
      );
    });
  });

  describe("Biopsy subcollection", () => {
    it("should successfully submit data when user is authenticated", async () => {
      db = initializeFirestore({ uid: "testId" });
      const { id } = await db.collection(collectionName).add(defaultValues);

      await firebase.assertSucceeds(
        db
          .collection(collectionName)
          .doc(id)
          .collection(biopsySubcollectionName)
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
          .collection(biopsySubcollectionName)
          .add(defaultValues)
      );
    });
  });

  describe("Specimen table subcollection", () => {
    it("should successfully submit data when user is authenticated", async () => {
      db = initializeFirestore({ uid: "testId" });
      const { id } = await db.collection(collectionName).add(defaultValues);
      const biopsy = await db
        .collection(collectionName)
        .doc(id)
        .collection(biopsySubcollectionName)
        .add(defaultValues);
      console.log(biopsy.id);

      await firebase.assertSucceeds(
        db
          .collection(collectionName)
          .doc(id)
          .collection(biopsySubcollectionName)
          .doc(biopsy.id)
          .collection(specimenSubcollectionName)
          .add(defaultValues)
      );
    });

    it("should fail to submit data when user is not authenticated", async () => {
      db = initializeFirestore({ uid: "testId" });
      const { id } = await db.collection(collectionName).add(defaultValues);
      const biopsy = await db
        .collection(collectionName)
        .doc(id)
        .collection(biopsySubcollectionName)
        .add(defaultValues);
      console.log(biopsy.id);

      // Firebase emulator doesn't provide a way to sign the user out
      db = initializeFirestore(null);

      await firebase.assertFails(
        db
          .collection(collectionName)
          .doc(id)
          .collection(biopsySubcollectionName)
          .doc(biopsy.id)
          .collection(specimenSubcollectionName)
          .add(defaultValues)
      );
    });
  });
});
