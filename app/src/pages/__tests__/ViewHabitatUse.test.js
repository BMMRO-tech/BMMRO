import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor } from "@testing-library/react";
import "setimmediate";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import { Datastore } from "../../datastore/datastore";
import ViewHabitatUse from "../ViewHabitatUse";

describe("ViewHabitatUse", () => {
  const projectId = "view-habitat-use-test-id";
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

  it("navigates to encounter overview page if no habitat use is found in firestore for a given ID", async () => {
    const { id } = await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    await firestoreEmulator
      .doc(`encounter/${id}`)
      .collection("habitatUse")
      .add({ age: "young", behaviour: "adventurous" });

    const entryPath = `/encounters/${id}/habitat-uses/123/edit`;
    const redirectPath = `/encounters/${id}/habitat-uses`;

    const { history } = renderWithMockContexts(
      <ViewHabitatUse encounterId={id} habitatUseId={"123"} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("navigates to habitat edit page if habitat has not been exported", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    const { id: habitatId } = await firestoreEmulator
      .doc(`encounter/${encounterId}`)
      .collection("habitatUse")
      .add({ age: "young", behaviour: "adventurous", exported: false });

    const entryPath = `/encounters/${encounterId}/habitat-uses/${habitatId}/view`;
    const redirectPath = `/encounters/${encounterId}/habitat-uses/${habitatId}/edit`;

    const { history } = renderWithMockContexts(
      <ViewHabitatUse encounterId={encounterId} habitatUseId={habitatId} />,
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

    const { id: habitatId } = await firestoreEmulator
      .doc(`encounter/${encounterId}`)
      .collection("habitatUse")
      .add({
        waterDepth: "",
        waterDepthBeyondSoundings: false,
        waterTemp: "",
        distance: "",
        surfaceBout: 0,
        exported: true,
      });

    const entryPath = `/encounters/${encounterId}/habitat-uses/${habitatId}/view`;

    const { getAllByRole } = renderWithMockContexts(
      <ViewHabitatUse encounterId={encounterId} habitatUseId={habitatId} />,
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

  it("renders the habitat use form with all fields disabled", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({
        exported: true,
        startTimestamp: new Date("2020-08-13T23:00:00.000Z"),
        startTime: "10:14",
      });

    const { id: habitatId } = await firestoreEmulator
      .doc(`encounter/${encounterId}`)
      .collection("habitatUse")
      .add({
        waterDepth: "",
        waterDepthBeyondSoundings: true,
        waterTemp: "",
        distance: "",
        surfaceBout: 0,
        exported: true,
      });

    const entryPath = `/encounters/${encounterId}/habitat-uses/${habitatId}/view`;

    const { getAllByTestId } = renderWithMockContexts(
      <ViewHabitatUse encounterId={encounterId} habitatUseId={habitatId} />,
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
