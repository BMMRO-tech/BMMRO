const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require("@firebase/rules-unit-testing");
const fs = require("fs");

const projectId = "bmmro-app";
const rules = fs.readFileSync(`${__dirname}/firestore.rules`, "utf8");

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules,
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

const authenticatedDb = () =>
  testEnv.authenticatedContext("testId").firestore();
const unauthenticatedDb = () => testEnv.unauthenticatedContext().firestore();

describe("Habitat Use Collection", () => {
  const collectionName = "habitatUse";

  afterEach(async () => {
    await testEnv.clearFirestore();
  });

  const defaultValues = {
    numberField: 1,
    textField: "Tight",
  };

  it("should successfully submit data when user is authenticated", async () => {
    const db = authenticatedDb();

    await assertSucceeds(db.collection(collectionName).add(defaultValues));
  });

  it("should fail to submit data when user is not authenticated", async () => {
    const db = unauthenticatedDb();

    await assertFails(db.collection(collectionName).add(defaultValues));
  });
});

describe("Encounter collection with habitat use subcollection", () => {
  const collectionName = "encounter";
  const habitatUseSubcollectionName = "habitatUse";
  const biopsySubcollectionName = "biopsy";
  const specimenSubcollectionName = "specimen";

  afterEach(async () => {
    await testEnv.clearFirestore();
  });

  const defaultValues = {
    numberField: 1,
    textField: "Tight",
  };

  describe("Encounter collection", () => {
    it("should successfully submit data when user is authenticated", async () => {
      const db = authenticatedDb();

      await assertSucceeds(db.collection(collectionName).add(defaultValues));
    });

    it("should fail to submit data when user is not authenticated", async () => {
      const db = unauthenticatedDb();

      await assertFails(db.collection(collectionName).add(defaultValues));
    });
  });

  describe("Habitat use subcollection", () => {
    it("should successfully submit data when user is authenticated", async () => {
      const db = authenticatedDb();
      const { id } = await db.collection(collectionName).add(defaultValues);

      await assertSucceeds(
        db
          .collection(collectionName)
          .doc(id)
          .collection(habitatUseSubcollectionName)
          .add(defaultValues),
      );
    });

    it("should fail to submit data when user is not authenticated", async () => {
      let db = authenticatedDb();
      const { id } = await db.collection(collectionName).add(defaultValues);

      // Firebase emulator doesn't provide a way to sign the user out
      db = unauthenticatedDb();

      await assertFails(
        db
          .collection(collectionName)
          .doc(id)
          .collection(habitatUseSubcollectionName)
          .add(defaultValues),
      );
    });
  });

  describe("Biopsy subcollection", () => {
    it("should successfully submit data when user is authenticated", async () => {
      const db = authenticatedDb();
      const { id } = await db.collection(collectionName).add(defaultValues);

      await assertSucceeds(
        db
          .collection(collectionName)
          .doc(id)
          .collection(biopsySubcollectionName)
          .add(defaultValues),
      );
    });

    it("should fail to submit data when user is not authenticated", async () => {
      let db = authenticatedDb();
      const { id } = await db.collection(collectionName).add(defaultValues);

      // Firebase emulator doesn't provide a way to sign the user out
      db = unauthenticatedDb();

      await assertFails(
        db
          .collection(collectionName)
          .doc(id)
          .collection(biopsySubcollectionName)
          .add(defaultValues),
      );
    });
  });

  describe("Specimen table subcollection", () => {
    it("should successfully submit data when user is authenticated", async () => {
      const db = authenticatedDb();
      const { id } = await db.collection(collectionName).add(defaultValues);
      const biopsy = await db
        .collection(collectionName)
        .doc(id)
        .collection(biopsySubcollectionName)
        .add(defaultValues);

      await assertSucceeds(
        db
          .collection(collectionName)
          .doc(id)
          .collection(biopsySubcollectionName)
          .doc(biopsy.id)
          .collection(specimenSubcollectionName)
          .add(defaultValues),
      );
    });

    it("should fail to submit data when user is not authenticated", async () => {
      let db = authenticatedDb();
      const { id } = await db.collection(collectionName).add(defaultValues);
      const biopsy = await db
        .collection(collectionName)
        .doc(id)
        .collection(biopsySubcollectionName)
        .add(defaultValues);

      // Firebase emulator doesn't provide a way to sign the user out
      db = unauthenticatedDb();

      await assertFails(
        db
          .collection(collectionName)
          .doc(id)
          .collection(biopsySubcollectionName)
          .doc(biopsy.id)
          .collection(specimenSubcollectionName)
          .add(defaultValues),
      );
    });
  });
});
