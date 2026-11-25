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

  it("navigates to /trips overview if the trip has been deleted", async () => {
    const { id: tripId } = await firestoreEmulator.collection("trip").add({
      exported: false,
      deleted: true,
      date: new Date("2020-08-13T23:00:00.000Z"),
      time: "10:14",
    });

    const { history } = renderWithMockContexts(
      <NewLogbookEntry tripId={tripId} />,
      {
        datastore,
        route: `/trips/${tripId}/logbook-entry/new`,
      },
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/trips");
    });
  });
});
