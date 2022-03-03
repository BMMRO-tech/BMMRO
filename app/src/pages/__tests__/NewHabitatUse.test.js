import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor, act, findByLabelText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
      <NewHabitatUse encounterId={"123"} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("sets hasEnded to true when ending habitat", async () => {
    await firestoreEmulator.collection("encounter").doc("789").set({
      name: "Barney",
      species: "Bottlenose dolphin",
    });

    const { findByRole } = renderWithMockContexts(
      <NewHabitatUse encounterId={"789"} />,
      { datastore }
    );

    const endHabitatButton = await findByRole("button", {
      name: "End Habitat",
    });
    await act(async () => {
      userEvent.click(endHabitatButton);
    });

    let habitatUses = [];
    const habitatData = await firestoreEmulator
      .doc("encounter/789")
      .collection("habitatUse")
      .get();
    habitatData.forEach((doc) => habitatUses.push(doc.data()));

    expect(habitatUses[0].hasEnded).toBe(true);
    expect(habitatUses.length).toBe(1);
  });

  it("does not submit the form when required fields are missing", async () => {
    const id = "790";
    await firestoreEmulator.collection("encounter").doc(id).set({
      name: "Barney",
      species: "Bottlenose dolphin",
    });

    const entryPath = `/encounters/${id}/habitat-uses`;

    const { history, findByRole, getByLabelText } = renderWithMockContexts(
      <NewHabitatUse encounterId={id} />,
      {
        datastore,
        route: entryPath,
      }
    );

    // const startTimeInput = await getByLabelText("Start time (hh:mm:ss)");

    const endHabitatButton = await findByRole("button", {
      name: "End Habitat",
    });

    await act(async () => {
      // userEvent(startTimeInput, "23:00:00", { delay: 1 });
      userEvent.click(endHabitatButton);
    });

    await waitFor(() => {
      expect(history.location.pathname).toEqual(entryPath);
      console.log(history.location);
      // console.log(endHabitatButton);
    });
  });
});
