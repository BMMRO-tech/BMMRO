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
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  afterEach(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
  });

  it("pending records should be true if adding when offline", async () => {
    const firestoreEmulator = getFirestore();
    const mockPendingCallback = jest.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback
    );

    pendingManager.addCollection("animal", {
      isSubcollection: false,
      pending: {},
    });
    firestoreEmulator.disableNetwork();

    firestoreEmulator.collection("animal").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback).toHaveBeenCalledWith(1);
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
      pending: {},
    });

    firestoreEmulator.collection("animal").doc("123").set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback).toHaveBeenCalledWith(0);
    });
  });

  it("pending records should be true if adding when offline to subcollection", async () => {
    const firestoreEmulator = getFirestore();
    const mockPendingCallback = jest.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback
    );

    pendingManager.addCollection("whale", {
      isSubcollection: true,
      pending: {},
    });
    firestoreEmulator.disableNetwork();

    firestoreEmulator.collection("animal/123/whale").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback).toHaveBeenCalledWith(1);
    });
  });

  it("pending records should be true when one collection has pending records and another does not", async () => {
    const firestoreEmulator = getFirestore();
    const mockPendingCallback = jest.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback
    );

    pendingManager.addCollection("animal", {
      isSubcollection: false,
      pending: {},
    });
    pendingManager.addCollection("whale", {
      isSubcollection: true,
      pending: {},
    });

    firestoreEmulator.collection("animal/123/whale").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback).toHaveBeenCalledWith(0);
    });

    firestoreEmulator.disableNetwork();

    firestoreEmulator.collection("animal").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(() => {
      expect(mockPendingCallback.mock.calls).toEqual([[1], [0], [1]]);
    });
  });
});
