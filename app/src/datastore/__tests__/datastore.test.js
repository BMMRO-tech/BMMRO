import { waitFor } from "@testing-library/react";
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

  describe("#readDocById", () => {
    it("sucessfully reads document with ID", async () => {
      const { id } = await firestoreEmulator
        .collection("dolphin")
        .add({ name: "Barney", species: "Bottlenose dolphin" });

      const datastore = new Datastore(firestoreEmulator);
      const barney = await datastore.readDocById(id, "dolphin");

      expect(barney).toEqual({ species: "Bottlenose dolphin", name: "Barney" });
    });

    it("throws datastore error if security rules reject read", async () => {
      const datastore = new Datastore(firestoreEmulator, false);
      const thrownError = await datastore
        .readDocById("non-existent id", "collection-without-read-permissions")
        .catch((err) => err);

      expect(thrownError.name).toEqual("DatastoreError");
      expect(thrownError.message).toEqual(DatastoreErrorType.COLLECTION_READ);
    });
  });

  describe("#readDocsByParentId", () => {
    it("successfully reads document with ID", async () => {
      const { id: parentId } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      await firestoreEmulator
        .collection("animal")
        .doc(parentId)
        .collection("whale")
        .add({ name: "Bill", species: "Blue" });

      await firestoreEmulator
        .collection("animal")
        .doc(parentId)
        .collection("whale")
        .add({ name: "Bob", species: "Narwal" });

      const datastore = new Datastore(firestoreEmulator);
      const animals = await datastore.readDocsByParentId(
        parentId,
        "animal",
        "whale"
      );

      expect(animals).toContainEqual({ name: "Bill", species: "Blue" });
      expect(animals).toContainEqual({ name: "Bob", species: "Narwal" });
    });

    it("throws datastore error if security rules reject read", async () => {
      const datastore = new Datastore(firestoreEmulator, false);

      const { id: parentId } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      const thrownError = await datastore
        .readDocsByParentId(parentId, "invalid-collection", "whale")
        .catch((err) => err);

      expect(thrownError.name).toEqual("DatastoreError");
      expect(thrownError.message).toEqual(DatastoreErrorType.COLLECTION_READ);
    });

    it("returns empty array if ID is invalid", async () => {
      const datastore = new Datastore(firestoreEmulator, false);
      const animals = await datastore.readDocsByParentId(
        "invalid-id",
        "animal",
        "whale"
      );

      expect(animals).toEqual([]);
    });
  });
  describe("#createDoc", () => {
    it("successfully creates document", async () => {
      const datastore = new Datastore(firestoreEmulator, false);

      const id = datastore.createDoc("dolphin", {
        name: "Sally",
        species: "Killer Whale",
      });

      const doc = await firestoreEmulator.collection("dolphin").doc(id).get();

      expect(doc.data()).toEqual({
        name: "Sally",
        species: "Killer Whale",
      });
    });

    it("triggers delayed error callback when creating document fails", async () => {
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
      const datastore = new Datastore(firestoreEmulator, false);

      const docRef = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      const id = datastore.createSubDoc(
        "whale",
        {
          name: "Sally",
          species: "Killer Whale",
        },
        docRef
      );

      const subDoc = await docRef.collection("whale").doc(id).get();

      expect(subDoc.data()).toEqual({
        name: "Sally",
        species: "Killer Whale",
      });
    });

    it("triggers delayed error callback when creating subdocument fails", async () => {
      const handleDelayedError = jest.fn();
      const datastore = new Datastore(
        firestoreEmulator,
        false,
        handleDelayedError
      );

      const docRef = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      datastore.createSubDoc(
        "fake-name",
        {
          name: "Sally",
          species: "Killer Whale",
        },
        docRef
      );

      await waitFor(() => {
        const callArg = handleDelayedError.mock.calls[0][0];
        expect(callArg.name).toEqual("FirebaseError");
      });
    });
  });
});
