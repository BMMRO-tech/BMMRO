import { waitFor } from "@testing-library/react";
import * as firebaseTesting from "@firebase/testing";
import fs from "fs";
import path from "path";

import { Datastore } from "../datastore";
import { PendingManager } from "../PendingManager";

const projectId = "pending-emulated";

const getFirestore = () => {
  return firebaseTesting
    .initializeTestApp({
      projectId,
      auth: { uid: "test-researcher" },
    })
    .firestore();
};

describe("PendingManager", () => {
  beforeAll(async () => {
    await firebaseTesting.loadFirestoreRules({
      projectId,
      rules: fs.readFileSync(
        path.resolve(__dirname, "test-emulator.rules"),
        "utf-8"
      ),
    });
  });

  afterAll(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("pending records should be true if adding when offline", async () => {
    const firestoreEmulator = getFirestore();
    const datastore = new Datastore(firestoreEmulator, false);
    const pendingManager = new PendingManager(datastore.firestore);

    pendingManager.addCollection({ name: "animal", subcollection: false });
    datastore.firestore.disableNetwork();

    datastore.createDoc("animal", {
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(pendingManager.hasPendingRecords()).toEqual(true);
    });
  });

  it("pending records should be false if adding when online", async () => {
    const firestoreEmulator = getFirestore();
    const datastore = new Datastore(firestoreEmulator, false);
    const pendingManager = new PendingManager(datastore.firestore);

    pendingManager.addCollection({
      name: "animal",
      subcollection: false,
      pending: true,
    });

    datastore.createDoc("animal", {
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(pendingManager.hasPendingRecords()).toEqual(false);
    });
  });

  it("pending records should be true if adding when offline to subcollection", async () => {
    const firestoreEmulator = getFirestore();
    const datastore = new Datastore(firestoreEmulator, false);
    const pendingManager = new PendingManager(datastore.firestore);

    pendingManager.addCollection({ name: "whale", subcollection: true });
    datastore.firestore.disableNetwork();

    datastore.createDoc("whale", {
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(pendingManager.hasPendingRecords()).toEqual(true);
    });
  });

  it("pending records should be true when one collection has pending records and another does not", async () => {
    const firestoreEmulator = getFirestore();
    const datastore = new Datastore(firestoreEmulator, false);
    const pendingManager = new PendingManager(datastore.firestore);

    pendingManager.addCollection({ name: "animal", subcollection: false });
    pendingManager.addCollection({ name: "whale", subcollection: true });

    datastore.createDoc("whale", {
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    datastore.firestore.disableNetwork();

    datastore.createDoc("animal", {
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(pendingManager.hasPendingRecords()).toEqual(true);
    });
  });
});
