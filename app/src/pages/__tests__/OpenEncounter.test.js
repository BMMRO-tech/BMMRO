import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import OpenEncounter from "../OpenEncounter";

describe("OpenEncounter", () => {
  const projectId = "open-encounter-test-id";
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

  it("navigates to /encounters/new if no encounter is found in firestore for a given ID", async () => {
    await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    const entryPath = "/encounters/123/habitat-uses";
    const redirectPath = "/encounters/new";

    const { history } = renderWithMockContexts(
      <OpenEncounter encounterId={"123"} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("does not allow to end the encounter if required fields are missing", async () => {
    await firestoreEmulator.collection("encounter").doc("a6789").set({
      species: "Bottlenose dolphin",
      area: "UK",
    });

    const { getByTestId } = renderWithMockContexts(
      <OpenEncounter encounterId={"a6789"} />,
      { datastore }
    );

    await waitFor(() => {
      const endButton = getByTestId("end-button");
      expect(endButton).toHaveAttribute("disabled");
    });
  });
});
