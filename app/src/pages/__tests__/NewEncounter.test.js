import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import * as firebaseTesting from "@firebase/testing";
import { Datastore } from "../../datastore/datastore";
import NewEncounter from "../NewEncounter";

describe("NewEncounterPage", () => {
  const projectId = "new-encounter-test-id";
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
    renderWithMockContexts(<NewEncounter />, {
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
  it("don't show new encounters button", async () => {
    renderWithMockContexts(<NewEncounter />, {
      datastore,
      route: "/encounters/new",
    });

    await waitFor(() =>
      expect(
        screen.queryByTestId("new-encounters-button")
      ).not.toBeInTheDocument()
    );
  });
});
