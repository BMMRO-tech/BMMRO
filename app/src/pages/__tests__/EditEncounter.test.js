import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor } from "@testing-library/react";

import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import { Datastore } from "../../datastore/datastore";
import EditEncounter from "../EditEncounter";

describe("EditEncounter", () => {
  const projectId = "edit-encounter-test-id";
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

  it("navigates to new encounter page if no encounter is found in firestore for a given ID", async () => {
    const entryPath = "/encounters/12345/edit";
    const redirectPath = "/encounters/new";

    const { history } = renderWithMockContexts(
      <EditEncounter encounterId={"12345"} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("navigates to encounter view page if encounter has been exported", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({
        exported: true,
        startTimestamp: new Date("2020-08-13T23:00:00.000Z"),
        startTime: "10:14",
      });

    const entryPath = `/encounters/${encounterId}/edit`;
    const redirectPath = `/encounters/${encounterId}/view`;

    const { history } = renderWithMockContexts(
      <EditEncounter encounterId={encounterId} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });
});
