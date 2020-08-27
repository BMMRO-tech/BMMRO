import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import ViewEncounter from "../ViewEncounter";

describe("ViewEncounter", () => {
  const projectId = "view-encounter-test";
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

  it("navigates to encounter edit page if encounter has not been exported", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({
        exported: false,
        startTimestamp: new Date("2020-08-13T23:00:00.000Z"),
        startTime: "10:14",
      });

    const entryPath = `/encounters/${encounterId}/view`;
    const redirectPath = `/encounters/${encounterId}/edit`;

    const { history } = renderWithMockContexts(
      <ViewEncounter encounterId={encounterId} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("has a link to the encounter overview page", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({
        exported: true,
        startTimestamp: new Date("2020-08-13T23:00:00.000Z"),
        startTime: "10:14",
      });

    const entryPath = `/encounters/${encounterId}/view`;

    const { getByRole } = renderWithMockContexts(
      <ViewEncounter encounterId={encounterId} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      const backLink = getByRole("link", {
        name: "Return to encounter overview",
      });
      expect(backLink.href).toContain(
        `/encounters/${encounterId}/habitat-uses`
      );
    });
  });
});
