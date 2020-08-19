import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor } from "@testing-library/react";

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
    async () => await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("navigates to new encounter page if no encounter is found in firestore for a given ID", async () => {
    const entryPath = `/encounters/12345/edit`;
    const redirectPath = `/encounters/new`;

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
});
