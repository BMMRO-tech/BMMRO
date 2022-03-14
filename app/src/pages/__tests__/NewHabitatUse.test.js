import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor, act } from "@testing-library/react";
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

    datastore.createSubDoc = jest.fn();

    const { findByRole, queryByTestId } = renderWithMockContexts(
      <NewHabitatUse encounterId={id} />,
      {
        datastore,
      }
    );

    const endHabitatButton = await findByRole("button", {
      name: "End Habitat",
    });

    await act(async () => {
      userEvent.click(endHabitatButton);
    });

    expect(queryByTestId(ModalText)).toBeInTheDocument();
    expect(datastore.createSubDoc).not.toHaveBeenCalled();
  });

  describe("positional data requirements and modal", () => {
    const id = "790";
    let submitButton;

    it("shows an info message around location data boxes if user chooses to stay on page", async () => {
      const { findByRole, queryByTestId } = renderWithMockContexts(
        <NewHabitatUse encounterId={id} />,
        {
          datastore,
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

    it("displays the positionalValidationModal if no positional data is entered", async () => {
      const { findByRole, queryByTestId } = renderWithMockContexts(
        <NewHabitatUse encounterId={id} />,
        {
          datastore,
        }
      );

      await act(async () => {
        submitButton = await findByRole("button", { name: "End Habitat" });
        userEvent.click(submitButton);
      });

      expect(queryByTestId("positional-data-modal")).toBeInTheDocument();
    });

    it("displays the positionalValidationModal if only the latitude is present", async () => {
      let latitudeInput;

      const { findByRole, queryByTestId } = renderWithMockContexts(
        <NewHabitatUse encounterId={id} />,
        {
          datastore,
        }
      );

      await act(async () => {
        latitudeInput = await findByRole("spinbutton", { name: "Lat" });
        submitButton = await findByRole("button", { name: "End Habitat" });

        await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
        userEvent.click(submitButton);
      });

      expect(queryByTestId("positional-data-modal")).toBeInTheDocument();
    });

    it("displays the positionalValidationModal if only the longitude is present", async () => {
      let longInput;

      const { findByRole, queryByTestId } = renderWithMockContexts(
        <NewHabitatUse encounterId={id} />,
        {
          datastore,
        }
      );

      await act(async () => {
        longInput = await findByRole("spinbutton", { name: "Long" });
        submitButton = await findByRole("button", { name: "End Habitat" });
        await userEvent.type(longInput, "15.123456", { delay: 1 });
        userEvent.click(submitButton);
      });

      expect(queryByTestId("positional-data-modal")).toBeInTheDocument();
      expect(queryByTestId("add-data-button")).toBeInTheDocument();
    });

    it("does not display the positionalValidationModal if gpsMark is present", async () => {
      let gps;

      const { findByRole, queryByTestId } = renderWithMockContexts(
        <NewHabitatUse encounterId={id} />,
        {
          datastore,
        }
      );

      await act(async () => {
        gps = await findByRole("textbox", { name: "GPS mark" });
        await userEvent.type(gps, "9", { delay: 1 });
        submitButton = await findByRole("button", { name: "End Habitat" });
        userEvent.click(submitButton);
      });

      expect(queryByTestId("positional-data-modal")).not.toBeInTheDocument();
    });

    it("if there is no positional data, after dismissing modal, will focus on that input", async () => {
      let latInput;

      const { findByRole, queryByTestId } = renderWithMockContexts(
        <NewHabitatUse encounterId={id} />,
        {
          datastore,
        }
      );

      await act(async () => {
        latInput = await findByRole("spinbutton", {
          name: "Lat",
        });
        submitButton = await findByRole("button", { name: "End Habitat" });
        userEvent.click(submitButton, { delay: 1 });
      });
      expect(queryByTestId("positional-data-modal")).toBeInTheDocument();
      expect(queryByTestId("add-data-button")).toBeInTheDocument();

      const modalButton = queryByTestId("add-data-button");
      userEvent.click(modalButton, { delay: 1 });
      expect(submitButton).not.toHaveFocus();
      expect(modalButton).not.toHaveFocus();
      await waitFor(() => {
        expect(latInput).toHaveFocus();
      });
    });
  });
});
