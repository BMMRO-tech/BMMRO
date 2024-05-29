import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/rules-unit-testing";
import { waitFor } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import EditHabitatUse from "../EditHabitatUse";
import { render } from "@testing-library/react";

describe("EditHabitatUse", () => {
  const projectId = "edit-habitat-use-test-id";
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

  it("navigates to encounter  page if no habitat use is found in firestore for a given ID", async () => {
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
      <EditHabitatUse encounterId={id} habitatUseId={"123"} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("navigates to habitat view page if habitat has been exported", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    const { id: habitatId } = await firestoreEmulator
      .doc(`encounter/${encounterId}`)
      .collection("habitatUse")
      .add({ age: "young", behaviour: "adventurous", exported: true });

    const entryPath = `/encounters/${encounterId}/habitat-uses/${habitatId}/edit`;
    const redirectPath = `/encounters/${encounterId}/habitat-uses/${habitatId}/view`;

    const { history } = renderWithMockContexts(
      <EditHabitatUse encounterId={encounterId} habitatUseId={habitatId} />,
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
