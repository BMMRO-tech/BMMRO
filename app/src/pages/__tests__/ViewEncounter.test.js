import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import {
  initTestEnv,
  getEmulatedFirestore,
  clearEmulatedData,
  cleanupTestEnv,
} from "../../utils/test/firestoreEmulator";
import { waitFor } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import ViewEncounter from "../ViewEncounter";

describe("ViewEncounter", () => {
  const projectId = "view-encounter-test";
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
      },
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("has two links to the encounter overview page", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({
        exported: true,
        startTimestamp: new Date("2020-08-13T23:00:00.000Z"),
        startTime: "10:14",
        endTimestamp: new Date("2020-08-14T10:14:00.000Z"),
        endTime: "10:14",
      });

    const entryPath = `/encounters/${encounterId}/view`;

    const { getAllByRole } = renderWithMockContexts(
      <ViewEncounter encounterId={encounterId} />,
      {
        datastore,
        route: entryPath,
      },
    );

    await waitFor(() => {
      const expectedLink = `/encounters/${encounterId}/habitat-uses`;

      const backLinks = getAllByRole("link", {
        name: "Return to encounter overview",
      });

      expect(backLinks).toHaveLength(2);
      expect(backLinks[0].href).toContain(expectedLink);
      expect(backLinks[1].href).toContain(expectedLink);
    });
  });

  it("renders the encounter form with all fields disabled", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({
        exported: true,
        startTimestamp: new Date("2020-08-13T23:00:00.000Z"),
        startTime: "10:14",
        endTimestamp: new Date("2020-08-14T10:14:00.000Z"),
        endTime: "10:14",
      });

    const entryPath = `/encounters/${encounterId}/view`;

    const { getAllByTestId } = renderWithMockContexts(
      <ViewEncounter encounterId={encounterId} />,
      {
        datastore,
        route: entryPath,
      },
    );

    await waitFor(() => {
      const fields = getAllByTestId(/^field-/);
      fields.map((field) => expect(field).toHaveAttribute("disabled"));
    });
  });
});
