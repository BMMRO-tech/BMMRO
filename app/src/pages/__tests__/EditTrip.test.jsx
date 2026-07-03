import React from "react";
import {
  initTestEnv,
  getEmulatedFirestore,
  clearEmulatedData,
  cleanupTestEnv,
} from "../../utils/test/firestoreEmulator";
import { waitFor } from "@testing-library/react";

import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import { Datastore } from "../../datastore/datastore";
import EditTrip from "../EditTrip";

describe("EditTrip", () => {
  const projectId = "edit-trip-test-id";
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

  it("navigates to new trip page if no trip is found in firestore for a given ID", async () => {
    const entryPath = "/trips/12345/edit";
    const redirectPath = "/trips/new";

    const { history } = renderWithMockContexts(<EditTrip tripId={"12345"} />, {
      datastore,
      route: entryPath,
    });

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("navigates to trip view page if trip has been exported", async () => {
    const { id: tripId } = await firestoreEmulator.collection("trip").add({
      exported: true,
      date: new Date("2020-08-13T23:00:00.000Z"),
      time: "10:14",
    });

    const entryPath = `/trips/${tripId}/edit`;
    const redirectPath = `/trips/${tripId}/view`;

    const { history } = renderWithMockContexts(<EditTrip tripId={tripId} />, {
      datastore,
      route: entryPath,
    });

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });
});
