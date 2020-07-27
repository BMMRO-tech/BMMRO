import * as firebaseTesting from "@firebase/testing";
import fs from "fs";
import path from "path";

import { Datastore } from "../datastore";
import { DatastoreErrorType } from "../../constants/datastore";

describe("datastore", () => {
  const projectId = "project-id";
  const uid = "test-researcher";
  let firestoreEmulator;

  beforeAll(async () => {
    const firebaseMock = firebaseTesting.initializeTestApp({
      projectId,
      auth: { uid },
    });
    firestoreEmulator = firebaseMock.firestore();
    await firebaseTesting.loadFirestoreRules({
      projectId,
      rules: fs.readFileSync(
        path.resolve(__dirname, "test-emulator.rules"),
        "utf-8"
      ),
    });
  });
  afterAll(async () => {
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });
  afterEach(
    async () => await firebaseTesting.clearFirestoreData({ projectId })
  );

  it("#readDocById - happy path", async () => {
    const { id } = await firestoreEmulator
      .collection("dolphin")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    const datastore = new Datastore(firestoreEmulator);
    const barney = await datastore.readDocById(id, "dolphin");

    expect(barney).toEqual({ species: "Bottlenose dolphin", name: "Barney" });
  });

  it("#readDocById - read error", async () => {
    const datastore = new Datastore(firestoreEmulator, false);
    const thrownError = await datastore
      .readDocById("non-existent id", "collection-without-read-permissions")
      .catch((err) => err);

    expect(thrownError.name).toEqual("DatastoreError");
    expect(thrownError.message).toEqual(DatastoreErrorType.COLLECTION_READ);
  });
});
