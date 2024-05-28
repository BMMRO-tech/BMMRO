import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/rules-unit-testing";
import { waitFor } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import EditBiopsy from "../EditBiopsy";

describe("EditBiopsy", () => {
  const projectId = "edit-biopsy-test-id";
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

  it("navigates to encounter overview page if no biopsy is found in firestore for a given ID", async () => {
    const { id } = await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    await firestoreEmulator
      .doc(`encounter/${id}`)
      .collection("biopsy")
      .add({ samplerName: "Homer Simpson", species: "Bottlenose dolphin" });

    const entryPath = `/encounters/${id}/biopsy/123/edit`;
    const redirectPath = `/encounters/${id}/habitat-uses`;

    const { history } = renderWithMockContexts(
      <EditBiopsy encounterId={id} biopsyId={"123"} />,
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
