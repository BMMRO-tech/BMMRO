import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/rules-unit-testing";
import { waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Datastore } from "../../datastore/datastore";
import OpenEncounter from "../OpenEncounter";

describe("OpenEncounter", () => {
  const projectId = "open-encounter-test-id";
  let firestoreEmulator;
  let datastore;

  beforeAll(() => {
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

  it("does not allow ending the encounter if required fields are missing", async () => {
    await firestoreEmulator.collection("encounter").doc("a6789").set({
      species: "Bottlenose dolphin",
      area: "UK",
    });
    const { findByRole } = renderWithMockContexts(
      <OpenEncounter encounterId={"a6789"} />,
      { datastore }
    );
    const endButton = await findByRole("button", {
      name: "End encounter",
    });

    await waitFor(() => {
      expect(endButton).toHaveAttribute("disabled");
    });
  });

  it("shows a button to end the encounter if the encounter contains all required field and it was not yet exported", async () => {
    await firestoreEmulator.collection("encounter").doc("123").set({
      species: "some species",
      area: "some area",
      sequenceNumber: "123",
      exported: false,
    });
    const { findByRole } = renderWithMockContexts(
      <OpenEncounter encounterId={"123"} />,
      { datastore }
    );
    const endButton = await findByRole("button", {
      name: "End encounter",
    });

    await waitFor(() => {
      expect(endButton).not.toHaveAttribute("disabled");
    });
  });

  it("has one link to the list of encounters if the encounter was previously exported", async () => {
    await firestoreEmulator.collection("encounter").doc("123").set({
      species: "some species",
      area: "some area",
      sequenceNumber: "123",
      exported: true,
    });
    const { getByText } = renderWithMockContexts(
      <OpenEncounter encounterId={"123"} />,
      { datastore }
    );

    await waitFor(() => {
      const expectedLink = "/encounters";
      const backLink = getByText("Return to encounter list");

      expect(backLink).toBeInTheDocument();
    });
  });

  it("sets hasEnded to true when ending encounter", async () => {
    await firestoreEmulator.collection("encounter").doc("abcd1234").set({
      species: "some species",
      area: "some area",
      sequenceNumber: "abcd1234",
      exported: false,
    });
    const { findByRole } = renderWithMockContexts(
      <OpenEncounter encounterId={"abcd1234"} />,
      { datastore }
    );

    const endEncounterButton = await findByRole("button", {
      name: "End encounter",
    });
    await act(async () => {
      userEvent.click(endEncounterButton);
    });

    const endedEncounter = (
      await firestoreEmulator.doc("encounter/abcd1234").get()
    ).data();
    await waitFor(() => {
      expect(endedEncounter.hasEnded).toBe(true);
    });
  });
});
