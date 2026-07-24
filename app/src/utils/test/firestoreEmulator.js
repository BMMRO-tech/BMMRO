import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import fs from "fs";
import path from "path";

let testEnv = null;

// Spins up a rules-unit-testing environment connected to the running Firestore
// emulator, loading the project's security rules. Call once per test file in a
// `beforeAll`. The returned context exposes a Firebase compat Firestore
// instance, which is what the app's Datastore expects.
export const initTestEnv = async (projectId, rules) => {
  const rulesContent =
    rules ??
    fs.readFileSync(
      path.resolve(__dirname, "../../../firestore/firestore.rules"),
      "utf8",
    );

  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules: rulesContent },
  });

  return testEnv;
};

// Returns an authenticated compat Firestore instance. Synchronous, so it can be
// used inside a (non-async) `beforeEach` once `initTestEnv` has resolved.
export const getEmulatedFirestore = (uid = "test-researcher") =>
  testEnv.authenticatedContext(uid).firestore();

export const clearEmulatedData = () => testEnv.clearFirestore();

export const cleanupTestEnv = async () => {
  if (testEnv) {
    await testEnv.cleanup();
    testEnv = null;
  }
};
