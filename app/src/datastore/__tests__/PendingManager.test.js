import { waitFor } from "@testing-library/react";
import * as firebaseTesting from "@firebase/testing";
import fs from "fs";
import path from "path";

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
    const mockPendingCallback = jest.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback
    );

    pendingManager.addCollection("animal", { isSubcollection: false });
    firestoreEmulator.disableNetwork();

    firestoreEmulator.collection("animal").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback).toHaveBeenCalledWith(true);
    });
  });

  it("pending records should be false if adding when online", async () => {
    const firestoreEmulator = getFirestore();
    const mockPendingCallback = jest.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback
    );

    pendingManager.addCollection("animal", {
      isSubcollection: false,
      pending: true,
    });

    firestoreEmulator.collection("animal").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback).toHaveBeenCalledWith(false);
    });
  });

  it("pending records should be true if adding when offline to subcollection", async () => {
    const firestoreEmulator = getFirestore();
    const mockPendingCallback = jest.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback
    );

    pendingManager.addCollection("whale", { isSubcollection: true });
    firestoreEmulator.disableNetwork();

    firestoreEmulator.collection("animal/123/whale").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback).toHaveBeenCalledWith(true);
    });
  });

  it("pending records should be true when one collection has pending records and another does not", async () => {
    const firestoreEmulator = getFirestore();
    const mockPendingCallback = jest.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback
    );

    pendingManager.addCollection("animal", { isSubcollection: false });
    pendingManager.addCollection("whale", { isSubcollection: true });

    firestoreEmulator.collection("animal/123/whale").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    firestoreEmulator.disableNetwork();

    firestoreEmulator.collection("animal").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback).toHaveBeenCalledWith(true);
    });
  });
});
