import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import NewHabitatUse from "../NewHabitatUse";

describe("NewHabitatUse", () => {
  const projectId = "new-habitat-use-test-id";
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

    const { history } = renderWithMockContexts(
      <NewHabitatUse encounterId={"123"} />,
      {
        datastore,
        route: "/encounters/123/habitat-uses",
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/encounters/new");
    });
  });

  it("stays on the same page if an encounter is found in firestore for a given ID", async () => {
    const { id } = await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    const { history } = renderWithMockContexts(
      <NewHabitatUse encounterId={id} />,
      {
        datastore,
        route: "/encounters/123/habitat-uses",
      }
    );

    await waitFor(async () => {
      expect(history.location.pathname).toEqual("/encounters/123/habitat-uses");
    });
  });
});
