import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EncounterForm from "../EncounterForm";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
}));

describe("EncounterForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:12.000Z").getTime()
    );
  });

  it("submits the form with correct values if all required fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (_, values) => {
      formValues = values;
    };

    const { getByRole } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const areaInput = getByRole("combobox", { name: "Area *" });
      const speciesInput = getByRole("combobox", { name: "Species *" });
      const encounterSequenceInput = getByRole("textbox", {
        name: "Encounter sequence *",
      });

      const submitButton = getByRole("button", { name: "Save" });
      userEvent.selectOptions(areaInput, "Central Andros");
      userEvent.selectOptions(speciesInput, "Fin whale");
      await userEvent.type(encounterSequenceInput, "123", { delay: 1 });
      userEvent.click(submitButton);
    });

    expect(formValues.area).toEqual("Central Andros");
    expect(formValues.species).toEqual("Fin whale");
    expect(formValues.sequenceNumber).toEqual("123");
    expect(formValues.startTimestamp).toEqual(
      new Date("2020-05-04T00:00:00.000Z")
    );
    expect(formValues.startTime).toEqual("11:30");
  });

  it("contains four fieldsets with the correct associated names", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    await waitFor(() => {
      const adultFieldset = getByRole("group", { name: "Number of adult" });
      expect(adultFieldset).not.toBeNull();

      const subAdultFieldset = getByRole("group", {
        name: "Number of sub adult",
      });
      expect(subAdultFieldset).not.toBeNull();

      const juvenileFieldset = getByRole("group", {
        name: "Number of juvenile",
      });
      expect(juvenileFieldset).not.toBeNull();

      const otherFieldset = getByRole("group", {
        name: "Number of other",
      });
      expect(otherFieldset).not.toBeNull();
    });
  });

  it("displays error and doesn't submit the form if required fields are not completed", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, getByLabelText } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    let errorMessage;

    await act(async () => {
      const submitButton = getByRole("button", { name: "Save" });
      userEvent.click(submitButton);

      errorMessage = getByLabelText("Area", {
        selector: '[role="alert"]',
      });
    });

    expect(errorMessage).not.toBeNull();
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it("if there is an error, after pressing submit button, will focus on that input", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    let submitButton;
    let encounterSequenceInput;

    await act(async () => {
      submitButton = getByRole("button", { name: "Save" });
      userEvent.click(submitButton);

      encounterSequenceInput = getByRole("textbox", {
        name: "Encounter sequence *",
      });
    });

    await waitFor(() => {
      expect(submitButton).not.toHaveFocus();
      expect(encounterSequenceInput).toHaveFocus();
    });
  });

  it("shows an error when best estimate is lower than low estimate", async () => {
    const mockHandleSubmit = jest.fn();

    const { getAllByRole, getByRole, getByLabelText } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const lowEstimateInput = getByRole("spinbutton", {
        name: "Low estimate",
      });
      await userEvent.type(lowEstimateInput, "123", { delay: 1 });
      const bestEstimateInput = getByRole("spinbutton", {
        name: "Best estimate",
      });
      await userEvent.type(bestEstimateInput, "122", { delay: 1 });

      const [submitButton] = getAllByRole("button");
      userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = getByLabelText("Low estimate", {
          selector: '[role="alert"]',
        });
        expect(errorMessage).not.toBeNull();
        expect(mockHandleSubmit).not.toHaveBeenCalled();
      });
    });
  });

  it("shows an error when high estimate is lower than best estimate", async () => {
    const mockHandleSubmit = jest.fn();

    const { getAllByRole, getByRole, getByLabelText } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const bestEstimateInput = getByRole("spinbutton", {
        name: "Best estimate",
      });
      await userEvent.type(bestEstimateInput, "122", { delay: 1 });

      const highEstimateInput = getByRole("spinbutton", {
        name: "High estimate",
      });
      await userEvent.type(highEstimateInput, "121", { delay: 1 });

      const [submitButton] = getAllByRole("button");
      userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = getByLabelText("Best estimate", {
          selector: '[role="alert"]',
        });
        expect(errorMessage).not.toBeNull();
        expect(mockHandleSubmit).not.toHaveBeenCalled();
      });
    });
  });

  it("displays a confirmation modal when user makes changes to the form and presses the Cancel button", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, queryByTestId } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const areaInput = getByRole("combobox", { name: "Area *" });
      userEvent.selectOptions(areaInput, "Central Andros");

      const cancelButton = getByRole("button", { name: "Cancel" });
      userEvent.click(cancelButton);
    });

    expect(queryByTestId("cancel-confirmation-modal")).toBeInTheDocument();
  });

  it("does not display a confirmation modal when user doesn't do any changes in the form and presses the Cancel button", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, queryByTestId } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={{ startTimestamp: new Date(), startTime: "10:55" }}
      />
    );

    await act(async () => {
      const cancelButton = getByRole("button", { name: "Cancel" });
      userEvent.click(cancelButton);
    });

    expect(queryByTestId("cancel-confirmation-modal")).not.toBeInTheDocument();
  });
});
