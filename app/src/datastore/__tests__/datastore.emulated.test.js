import { waitFor } from "@testing-library/react";
import * as firebaseTesting from "@firebase/testing";
import fs from "fs";
import path from "path";

import { Datastore } from "../datastore";
import { DatastoreErrorType } from "../../constants/datastore";

const getFirestore = () => {
  return firebaseTesting
    .initializeTestApp({
      projectId: "project-id",
      auth: { uid: "test-researcher" },
    })
    .firestore();
};

describe("datastore", () => {
  const projectId = "project-id";

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
  beforeEach(
    async () => await firebaseTesting.clearFirestoreData({ projectId })
  );

  describe("#readDocByPath", () => {
    it("successfully reads document with path", async () => {
      const firestoreEmulator = getFirestore();

      const { id } = await firestoreEmulator
        .collection("dolphin")
        .add({ name: "Barney", species: "Bottlenose dolphin" });

      const datastore = new Datastore(firestoreEmulator);
      const { data: animal, path } = await datastore.readDocByPath(
        `dolphin/${id}`
      );

      expect(path).toEqual(`dolphin/${id}`);
      expect(animal).toEqual({ species: "Bottlenose dolphin", name: "Barney" });
    });

    it("throws datastore error if security rules reject read", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, false);
      const thrownError = await datastore
        .readDocByPath("collection-without-read-permissions/non-existent-id")
        .catch((err) => err);

      expect(thrownError.name).toEqual("DatastoreError");
      expect(thrownError.message).toEqual(DatastoreErrorType.COLLECTION_READ);
    });
  });

  describe("#readDocsByParentPath", () => {
    it("successfully reads subdocuments by parent path", async () => {
      const firestoreEmulator = getFirestore();

      const { path: parentPath } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      const { path: firstAnimalPath } = await firestoreEmulator
        .doc(parentPath)
        .collection("whale")
        .add({ name: "Bill", species: "Blue" });

      const { path: secondAnimalPath } = await firestoreEmulator
        .doc(parentPath)
        .collection("whale")
        .add({ name: "Bob", species: "Narwal" });

      const datastore = new Datastore(firestoreEmulator);
      const animals = await datastore.readDocsByParentPath(parentPath, "whale");

      const animalsData = animals.map((animal) => animal.data);
      const animalPaths = animals.map((animal) => animal.path);

      expect(animalsData).toContainEqual({ name: "Bill", species: "Blue" });
      expect(animalsData).toContainEqual({ name: "Bob", species: "Narwal" });
      expect(animalPaths).toContain(firstAnimalPath);
      expect(animalPaths).toContain(secondAnimalPath);
    });

    it("throws datastore error if security rules reject read", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, false);

      const { id: parentId } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      const thrownError = await datastore
        .readDocsByParentPath(`invalid-collection/${parentId}`, "whale")
        .catch((err) => err);

      expect(thrownError.name).toEqual("DatastoreError");
      expect(thrownError.message).toEqual(DatastoreErrorType.COLLECTION_READ);
    });

    it("returns empty array if parent path id is invalid", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, false);
      const animals = await datastore.readDocsByParentPath(
        "animal/invalid-id",
        "whale"
      );

      expect(animals).toEqual([]);
    });
  });

  describe("#createDoc", () => {
    it("successfully creates document", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, false);

      const id = datastore.createDoc("dolphin", {
        name: "Sally",
        species: "Killer Whale",
      });

      const doc = await firestoreEmulator.doc(`dolphin/${id}`).get();

      expect(doc.data()).toEqual({
        name: "Sally",
        species: "Killer Whale",
      });
    });

    it("triggers delayed error callback when creating document fails", async () => {
      const firestoreEmulator = getFirestore();

      const handleDelayedError = jest.fn();
      const datastore = new Datastore(
        firestoreEmulator,
        false,
        handleDelayedError
      );

      datastore.createDoc("fake-name", {
        name: "Sally",
        species: "Killer Whale",
      });

      await waitFor(() => {
        const callArg = handleDelayedError.mock.calls[0][0];
        expect(callArg.name).toEqual("FirebaseError");
      });
    });
  });

  describe("#createSubDoc", () => {
    it("successfully creates subdocument", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, false);

      const { id: parentId } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      const subDocId = datastore.createSubDoc(`animal/${parentId}`, "whale", {
        name: "Sally",
        species: "Killer Whale",
      });

      const subDoc = await firestoreEmulator
        .doc(`animal/${parentId}/whale/${subDocId}`)
        .get();

      expect(subDoc.data()).toEqual({
        name: "Sally",
        species: "Killer Whale",
      });
    });

    it("triggers delayed error callback when creating subdocument fails", async () => {
      const firestoreEmulator = getFirestore();

      const handleDelayedError = jest.fn();
      const datastore = new Datastore(
        firestoreEmulator,
        false,
        handleDelayedError
      );

      const { id: parentId } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      datastore.createSubDoc(`animal/${parentId}`, "fake-name", {
        name: "Sally",
        species: "Killer Whale",
      });

      await waitFor(() => {
        const callArg = handleDelayedError.mock.calls[0][0];
        expect(callArg.name).toEqual("FirebaseError");
      });
    });
  });
});
