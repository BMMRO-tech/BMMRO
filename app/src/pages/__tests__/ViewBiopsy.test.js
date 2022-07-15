import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor } from "@testing-library/react";

import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import { Datastore } from "../../datastore/datastore";
import ViewBiopsy from "../ViewBiopsy";

describe("ViewBiopsy", () => {
  const projectId = "view-biopsy-test-id";
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

  afterEach(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("navigates to encounter overview page if no biopsy is found in firestore for a given ID", async () => {
    const { id } = await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    await firestoreEmulator
      .doc(`encounter/${id}`)
      .collection("biopsy")
      .add({ samplerName: "Homer Simpson", species: "Bottlenose dolphin" });

    const entryPath = `/encounters/${id}/biopsies/123/edit`;
    const redirectPath = `/encounters/${id}/habitat-uses`;

    const { history } = renderWithMockContexts(
      <ViewBiopsy encounterId={id} biopsyId={"123"} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("navigates to biopsy edit page if biopsy has not been exported", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    const { id: biopsyId } = await firestoreEmulator
      .doc(`encounter/${encounterId}`)
      .collection("biopsy")
      .add({
        samplerName: "Homer Simpson",
        species: "Bottlenose dolphin",
        exported: false,
      });

    const entryPath = `/encounters/${encounterId}/biopsies/${biopsyId}/view`;
    const redirectPath = `/encounters/${encounterId}/biopsies/${biopsyId}/edit`;

    const { history } = renderWithMockContexts(
      <ViewBiopsy encounterId={encounterId} biopsyId={biopsyId} />,
      {
        datastore,
        route: entryPath,
      }
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
      });

    const { id: biopsyId } = await firestoreEmulator
      .doc(`encounter/${encounterId}`)
      .collection("biopsy")
      .add({
        samplerName: "Homer Simpson",
        species: "Bottlenose dolphin",
        exported: true,
      });

    const entryPath = `/encounters/${encounterId}/biopsies/${biopsyId}/view`;

    const { getAllByRole } = renderWithMockContexts(
      <ViewBiopsy encounterId={encounterId} biopsyId={biopsyId} />,
      {
        datastore,
        route: entryPath,
      }
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

  it("renders the biopsy form with all fields disabled", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({
        exported: true,
        startTimestamp: new Date("2020-08-13T23:00:00.000Z"),
        startTime: "10:14",
      });

    const { id: biopsyId } = await firestoreEmulator
      .doc(`encounter/${encounterId}`)
      .collection("biopsy")
      .add({
        areaHit: "Upper Dorsal",
        dorsalHit: "Yes",
        whaleSide: "Right",
        species: "Sperm whale",
        samplerName: "Bruce Wayne",
        attempt: 4,
        dateTaken: "Thu Jul 14 2022 11:56:43 GMT+0100",
        timeTaken: "10:52:04",
        latitude: "1.234567",
        longitude: "-2.345678",
        gpsMark: 12,
        totalSpecimens: 3,
        hasEnded: false,
        exported: true,
      });

    const entryPath = `/encounters/${encounterId}/biopsies/${biopsyId}/view`;

    const { getAllByTestId } = renderWithMockContexts(
      <ViewBiopsy encounterId={encounterId} biopsyId={biopsyId} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      const fields = getAllByTestId(/^field-/);
      fields.map((field) => expect(field).toHaveAttribute("disabled"));
    });
  });
});
