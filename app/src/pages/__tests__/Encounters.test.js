import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import * as firebaseTesting from "@firebase/rules-unit-testing";
import { Datastore } from "../../datastore/datastore";
import Encounters from "../Encounters";

describe("EncountersOverviewPage", () => {
  const projectId = "trips-overview-test-id";
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
    renderWithMockContexts(<Encounters />, {
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
  it("show new encounters button", async () => {
    renderWithMockContexts(<Encounters />, {
      datastore,
      route: "/encounters",
    });

    await waitFor(() =>
      expect(screen.getByTestId("new-encounters-button")).toBeInTheDocument()
    );
  });
});
