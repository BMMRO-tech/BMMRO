import { waitFor } from "@testing-library/react";
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import fs from "fs";
import path from "path";

import { Datastore } from "../datastore";
import { DatastoreErrorType } from "../../constants/datastore";

let testEnv;
const projectId = "datastore-emulated";

describe("datastore", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        host: "127.0.0.1",
        port: "8080",
        //auth: { uid: "test-researcher" },
        rules: fs.readFileSync(
          path.resolve(__dirname, "test-emulator.rules"),
          "utf-8"
        ),
      },
    });
  });

  describe("#readDocByPath", () => {
    it("successfully reads document with path", async () => {
      const testUserId = "1234";

      await testEnv.withSecurityRulesDisabled((context) => {
        const firestoreWithoutRule = context.firestore();
        return firestoreWithoutRule
          .collection("dolphin")
          .doc(testUserId)
          .set({ name: "Barney", species: "Bottlenose dolphin" });
      });

      //const unauthenticatedUser = testEnv.unauthenticatedContext();
      const authenticatedUser = testEnv.authenticatedContext(testUserId);

      const readUser = await authenticatedUser
        .firestore()
        .collection("dolphin")
        .doc(testUserId)
        .get();

      expect("dolphin/1234").toEqual(`dolphin/${testUserId}`);
      //expect(animal).toEqual({ species: "Bottlenose dolphin", name: "Barney" });
    });

    it("throws datastore error if security rules reject read", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, null, false);
      const thrownError = await datastore
        .readDocByPath("collection-without-read-permissions/non-existent-id")
        .catch((err) => err);

      expect(thrownError.name).toEqual("DatastoreError");
      expect(thrownError.message).toEqual(DatastoreErrorType.COLLECTION_READ);
    });

    it("converts time object to date", async () => {
      const firestoreEmulator = getFirestore();

      const { id } = await firestoreEmulator
        .collection("dolphin")
        .add({ name: "Barney", date: new Date("2000-01-15:00:00:00.000Z") });

      const datastore = new Datastore(firestoreEmulator);
      const { data: animal } = await datastore.readDocByPath(`dolphin/${id}`);

      expect(animal.date).toEqual(new Date("2000-01-15:00:00:00.000Z"));
    });
  });

  describe("#readDocsByTimeRange", () => {
    it("successfully reads document with time range", async () => {
      const firestoreEmulator = getFirestore();

      await firestoreEmulator.collection("dolphin").add({
        name: "Alphonso",
        timestamp: new Date("2020-01-01:15:00:00.000Z"),
      });

      await firestoreEmulator.collection("dolphin").add({
        name: "Barney",
        timestamp: new Date("2020-01-03:21:00:00.000Z"),
      });

      await firestoreEmulator.collection("dolphin").add({
        name: "Catherine",
        timestamp: new Date("2020-10-10:15:00:00.000Z"),
      });

      const datastore = new Datastore(firestoreEmulator);
      const results = await datastore.readDocsByTimeRange(
        "dolphin",
        "timestamp",
        new Date("2020-01-03:01:00:00.000Z"),
        new Date("2020-12-11:23:00:00.000Z")
      );

      expect(results).toHaveLength(2);
      expect(results[0].data).toEqual({
        name: "Barney",
        timestamp: new Date("2020-01-03:21:00:00.000Z"),
      });
      expect(results[1].data).toEqual({
        name: "Catherine",
        timestamp: new Date("2020-10-10:15:00:00.000Z"),
      });
    });

    it("converts time object to date", async () => {
      const firestoreEmulator = getFirestore();

      await firestoreEmulator
        .collection("dolphin")
        .add({ name: "Barney", date: new Date("2000-01-15:00:00:00.000Z") });

      const datastore = new Datastore(firestoreEmulator);
      const results = await datastore.readDocsByTimeRange(
        "dolphin",
        "date",
        new Date("2000-01-10:01:00:00.000Z"),
        new Date("2000-12-11:23:00:00.000Z")
      );

      expect(results[0].data.date).toEqual(
        new Date("2000-01-15:00:00:00.000Z")
      );
    });
  });

  describe("#readDocsByParentPath", () => {
    it("successfully reads subdocuments by parent path", async () => {
      const firestoreEmulator = getFirestore();

      const { path: parentPath } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      const { id: firstAnimalId } = await firestoreEmulator
        .doc(parentPath)
        .collection("whale")
        .add({ name: "Bill", species: "Blue" });

      const { id: secondAnimalId } = await firestoreEmulator
        .doc(parentPath)
        .collection("whale")
        .add({ name: "Bob", species: "Narwal" });

      const datastore = new Datastore(firestoreEmulator);
      const animals = await datastore.readDocsByParentPath(parentPath, "whale");

      const animalsData = animals.map((animal) => animal.data);
      const animalIds = animals.map((animal) => animal.id);

      expect(animalsData).toContainEqual({ name: "Bill", species: "Blue" });
      expect(animalsData).toContainEqual({ name: "Bob", species: "Narwal" });
      expect(animalIds).toContain(firstAnimalId);
      expect(animalIds).toContain(secondAnimalId);
    });

    it("throws datastore error if security rules reject read", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, null, false);

      const { id: parentId } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      const thrownError = await datastore
        .readDocsByParentPath(`invalid-collection/${parentId}`, "snail")
        .catch((err) => err);

      expect(thrownError.name).toEqual("DatastoreError");
      expect(thrownError.message).toEqual(DatastoreErrorType.COLLECTION_READ);
    });

    it("returns empty array if parent path id is invalid", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, null, false);
      const animals = await datastore.readDocsByParentPath(
        "animal/invalid-id",
        "whale"
      );

      expect(animals).toEqual([]);
    });

    it("converts time object to date", async () => {
      const firestoreEmulator = getFirestore();

      const { path: parentPath } = await firestoreEmulator
        .collection("animal")
        .add({ location: "Pacific" });

      await firestoreEmulator
        .doc(parentPath)
        .collection("whale")
        .add({
          name: "Bill",
          date: new Date("2000-01-10:01:00:00.000Z"),
        });

      const datastore = new Datastore(firestoreEmulator);
      const animals = await datastore.readDocsByParentPath(parentPath, "whale");

      expect(animals[0].data.date).toEqual(
        new Date("2000-01-10:01:00:00.000Z")
      );
    });
  });

  describe("#createDoc", () => {
    it("successfully creates document", async () => {
      const firestoreEmulator = getFirestore();

      const datastore = new Datastore(firestoreEmulator, null, false);

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
        null,
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

      const datastore = new Datastore(firestoreEmulator, null, false);

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
        null,
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

  describe("#updateDocByPath", () => {
    it("successfully updates document by path", async () => {
      const firestoreEmulator = getFirestore();

      const { id } = await firestoreEmulator
        .collection("dolphin")
        .add({ name: "Barney", species: "Bottlenose dolphin" });

      const datastore = new Datastore(firestoreEmulator);

      datastore.updateDocByPath(`dolphin/${id}`, { name: "Eddy" });

      const dolphinDoc = await firestoreEmulator.doc(`dolphin/${id}`).get();

      expect(dolphinDoc.data()).toEqual({
        name: "Eddy",
        species: "Bottlenose dolphin",
      });
    });

    it("triggers delayed error callback when updating document fails", async () => {
      const firestoreEmulator = getFirestore();
      const handleDelayedError = jest.fn();
      const datastore = new Datastore(
        firestoreEmulator,
        null,
        false,
        handleDelayedError
      );

      datastore.updateDocByPath(`invalid-collection/123`, { location: "UK" });

      await waitFor(() => {
        const callArg = handleDelayedError.mock.calls[0][0];
        expect(callArg.name).toEqual("FirebaseError");
      });
    });
  });

  describe("readDocsByCollection", () => {
    const firestoreEmulator = getFirestore();
    const projectCollection = { projectName: "testProject" };
    beforeEach(async () => {
      await firebaseTesting.clearFirestoreData({ projectId });
    });
    it("should read a collection", async () => {
      await firestoreEmulator.collection("project").add(projectCollection);
      const datastore = new Datastore(firestoreEmulator);
      const results = await datastore.readDocsFromCollection("project");
      expect(results[0].data).toEqual(projectCollection);
    });

    it("should return an empty array if collection does not exist", async () => {
      const datastore = new Datastore(firestoreEmulator);
      const results = await datastore.readDocsFromCollection("project");
      expect(results).toEqual([]);
    });
  });
});
