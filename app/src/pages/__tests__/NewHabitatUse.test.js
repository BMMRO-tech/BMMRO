import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import {
  waitFor,
  act,
  findByLabelText,
  getByTestId,
  queryByTestId,
} from "@testing-library/react";
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

    const { findByRole, findByLabelText } = renderWithMockContexts(
      <NewHabitatUse encounterId={"789"} />,
      {
        datastore,
      }
    );

    const endHabitatButton = await findByRole("button", {
      name: "End Habitat",
    });
    const latField = await findByLabelText("Lat", { selector: "input" });
    const longField = await findByLabelText("Long", { selector: "input" });

    await act(async () => {
      await userEvent.type(longField, "0.111111", { delay: 1 });
      await userEvent.type(latField, "0.111111", { delay: 1 });

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
    const ModalText = "positional-data-modal";
    const id = "790";
    await firestoreEmulator.collection("encounter").doc(id).set({
      name: "Barney",
      species: "Bottlenose dolphin",
    });

    const entryPath = `/encounters/${id}/habitat-uses`;
    datastore.createSubDoc = jest.fn();

    const { findByRole, queryByTestId } = renderWithMockContexts(
      <NewHabitatUse encounterId={id} />,
      {
        datastore,
        route: entryPath,
      }
    );

    const endHabitatButton = await findByRole("button", {
      name: "End Habitat",
    });

    let errorMessage;

    await act(async () => {
      userEvent.click(endHabitatButton);
    });

    expect(queryByTestId(ModalText)).toBeInTheDocument();
    expect(datastore.createSubDoc).not.toHaveBeenCalled();
  });

  it("shows an info message around location data boxes if user chooses to stay on page", async () => {
    const id = "790";

    await firestoreEmulator.collection("encounter").doc(id).set({
      name: "Barney",
      species: "Bottlenose dolphin",
    });

    const entryPath = `/encounters/${id}/habitat-uses`;
    datastore.createSubDoc = jest.fn();
    let submitButton;

    const { findByRole, queryByTestId } = renderWithMockContexts(
      <NewHabitatUse encounterId={id} />,
      {
        datastore,
        route: entryPath,
      }
    );

    await act(async () => {
      submitButton = await findByRole("button", { name: "End Habitat" });
      userEvent.click(submitButton, { delay: 1 });
    });

    expect(queryByTestId("positional-data-modal")).toBeInTheDocument();
    expect(queryByTestId("add-data-button")).toBeInTheDocument();

    const modalButton = queryByTestId("add-data-button");
    userEvent.click(modalButton, { delay: 5 });

    const positionData = await queryByTestId("positional-data-validation");

    expect(queryByTestId("positional-data-modal")).not.toBeInTheDocument();

    expect(positionData).toBeInTheDocument();
  });
});
