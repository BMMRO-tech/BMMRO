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
import EditBiopsy from "../EditBiopsy";

describe("EditBiopsy", () => {
  const projectId = "edit-biopsy-test-id";
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
      },
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });
});
