import { waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";

import {
  initTestEnv,
  getEmulatedFirestore,
  clearEmulatedData,
  cleanupTestEnv,
} from "../../utils/test/firestoreEmulator";
import { PendingManager } from "../PendingManager";
import { vi } from "vitest";

const projectId = "pending-emulated";

describe("PendingManager ", () => {
  let firestoreEmulator;

  beforeAll(async () => {
    await initTestEnv(
      projectId,
      fs.readFileSync(path.resolve(__dirname, "test-emulator.rules"), "utf-8"),
    );
  });

  afterAll(async () => {
    await cleanupTestEnv();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    firestoreEmulator = getEmulatedFirestore();
  });

  afterEach(async () => {
    // Re-enable network before clearing data so any pending-write listeners
    // don't fire against a disabled network, which corrupts the gRPC stream
    // and causes the next test's Firestore instance to inherit broken state.
    await firestoreEmulator.enableNetwork();
    await clearEmulatedData();
  });

  it("sets pendingCount to 1, when one added while offline", async () => {
    const mockPendingCallback = vi.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback,
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

    await waitFor(
      () => {
        expect(mockPendingCallback).toHaveBeenCalledWith(1);
      },
      { timeout: 5000 },
    );
  });

  it("sets pendingCount to 0, when one added while online", async () => {
    const mockPendingCallback = vi.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback,
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

    await waitFor(
      () => {
        expect(mockPendingCallback).toHaveBeenCalledWith(0);
      },
      { timeout: 5000 },
    );
  });

  it("sets pending count to 1, when one subdoc is added while offline", async () => {
    const mockPendingCallback = vi.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback,
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

    await waitFor(
      () => {
        expect(mockPendingCallback).toHaveBeenCalledWith(1);
      },
      { timeout: 5000 },
    );
  });

  it("sets pending count to 1, when one collection has pending records and the other doesn't", async () => {
    const mockPendingCallback = vi.fn();
    const pendingManager = new PendingManager(
      firestoreEmulator,
      mockPendingCallback,
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

    await waitFor(
      () => {
        expect(mockPendingCallback).toHaveBeenCalledWith(1);
      },
      { timeout: 5000 },
    );

    await waitFor(
      () => {
        expect(mockPendingCallback).toHaveBeenLastCalledWith(0);
      },
      { timeout: 5000 },
    );

    firestoreEmulator.disableNetwork();

    firestoreEmulator.collection("animal").doc().set({
      name: "Sally",
      species: "Killer Whale",
      exported: false,
    });

    await waitFor(
      () => {
        expect(mockPendingCallback).toHaveBeenLastCalledWith(1);
      },
      { timeout: 5000 },
    );
  });
});
