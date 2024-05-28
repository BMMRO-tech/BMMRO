import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/rules-unit-testing";
import { waitFor } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import EditLogbookEntry from "../EditLogbookEntry";

describe("EditLogbookEntry", () => {
  const defaultTrip = {
    area: "Central Andros",
    engineHoursMeterReading: "",
    exported: true,
    gpsFileName: "24_0517Mu.txt",
    hasEnded: true,
    numberOfObservers: 0,
    observers: "",
    project: "",
    time: "12:43",
    tripId: "24_0517Mu1",
    tripNumber: 1,
    vessel: "Multiple",
    windDirection: "",
    windSpeed: "",
  };

  const projectId = "edit-logbook-entry-test-id";
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

  it("navigates to trip overview page if no logbook entry is found in firestore for a given ID", async () => {
    const { id } = await firestoreEmulator.collection("trip").add({
      ...defaultTrip,
    });

    await firestoreEmulator
      .doc(`trip/${id}`)
      .collection("logbookEntry")
      .add({ time: "12:43", waterDepth: "", waterDepthBeyondSoundings: false });

    const entryPath = `/trips/${id}/logbook-entry/123/edit`;
    const redirectPath = `/trips/${id}/view`;

    const { history } = renderWithMockContexts(
      <EditLogbookEntry tripId={id} logbookId={"123"} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("navigates to logbook view page if logbook has been exported", async () => {
    const { id: tripId } = await firestoreEmulator.collection("trip").add({
      ...defaultTrip,
    });

    const { id: logbookId } = await firestoreEmulator
      .doc(`trip/${tripId}`)
      .collection("logbookEntry")
      .add({
        time: "12:43",
        waterDepth: "",
        waterDepthBeyondSoundings: false,
        exported: true,
      });

    const entryPath = `/trips/${tripId}/logbook-entry/${logbookId}/edit`;
    const redirectPath = `/trips/${tripId}/logbook-entry/${logbookId}/edit`;

    const { history, queryByTestId } = renderWithMockContexts(
      <EditLogbookEntry tripId={tripId} logbookId={logbookId} />,
      {
        datastore,
        route: entryPath,
      }
    );
    await waitFor(() => {
      expect(queryByTestId("exported-info")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });
});
