import React from "react";
import { screen, waitFor } from "@testing-library/react";
import NewLogbookEntry from "../NewLogbookEntry";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import * as firebaseTesting from "@firebase/testing";
import { Datastore } from "../../datastore/datastore";

describe("NewLogbookEntry", () => {
  const projectId = "new-logbook-entry-test-id";
  let firestoreEmulator;
  let datastore;

  beforeEach(() => {
    firestoreEmulator = firebaseTesting
      .initializeTestApp({
        projectId,
        auth: { uid: "test-researcher" },
      })
      .firestore();

    datastore = new Datastore(firestoreEmulator);
  });

  afterAll(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("show encounter and trips tabs", async () => {
    renderWithMockContexts(<NewLogbookEntry />, {
      datastore,
    });

    await waitFor(() =>
      expect(
        screen.getByText("ENCOUNTERS", { selector: "button" })
      ).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.getByText("TRIPS", { selector: "button" })
      ).toBeInTheDocument()
    );
  });
});
