import React from "react";
import { screen, waitFor } from "@testing-library/react";
import NewLogbookEntry from "../NewLogbookEntry";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import {
  initTestEnv,
  getEmulatedFirestore,
  clearEmulatedData,
  cleanupTestEnv,
} from "../../utils/test/firestoreEmulator";
import { Datastore } from "../../datastore/datastore";

describe("NewLogbookEntry", () => {
  const projectId = "new-logbook-entry-test-id";
  let firestoreEmulator;
  let datastore;

  beforeAll(async () => {
    await initTestEnv(projectId);
  });

  beforeEach(() => {
    firestoreEmulator = getEmulatedFirestore();
    datastore = new Datastore(firestoreEmulator);
  });

  afterEach(async () => {
    await clearEmulatedData();
  });

  afterAll(async () => {
    await cleanupTestEnv();
  });

  it("show encounter and trips tabs", async () => {
    renderWithMockContexts(<NewLogbookEntry />, {
      datastore,
    });

    await waitFor(() =>
      expect(
        screen.getByText("ENCOUNTERS", { selector: "button" }),
      ).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByText("TRIPS", { selector: "button" }),
      ).toBeInTheDocument(),
    );
  });

  it("navigates to /trips overview if no trip is found in firestore for a given ID", async () => {
    await firestoreEmulator.collection("trip");

    const entryPath = "/trips/123/logbook-entry/new";
    const redirectPath = "/trips";

    const { history } = renderWithMockContexts(
      <NewLogbookEntry tripId={"123"} />,
      {
        datastore,
        route: entryPath,
      },
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });
});
