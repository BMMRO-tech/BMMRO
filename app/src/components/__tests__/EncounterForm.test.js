import React from "react";
import { act, render, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EncounterForm from "../EncounterForm";
import encounterDefaultValues from "../../constants/encounterDefaultValues";
import getErrorMessage from "../../utils/getErrorMessage";
import { FormErrorType } from "../../constants/forms";
import { changeInputMaskValue } from "../../utils/test/changeInputMaskValue";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
}));

describe("EncounterForm", () => {
  const mockEncounterValues = {
    ...encounterDefaultValues,
    sequenceNumber: "123",
    species: "Bimini",
    startTimestamp: new Date("2020-05-04T00:00:00.000Z"),
    startTime: "09:44",
  };

  it("submits the form with correct values if all required fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (_, values) => {
      formValues = values;
    };

    const { getByRole } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={{
          ...mockEncounterValues,
          sequenceNumber: "",
          area: "",
          species: "",
        }}
      />
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
  });

  it("contains four fieldsets with the correct associated names", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={mockEncounterValues}
      />
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
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={mockEncounterValues}
      />
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
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={{ ...mockEncounterValues, sequenceNumber: "" }}
      />
    );

    let submitButton;
    let encounterSequenceInput;

    submitButton = getByRole("button", { name: "Save" });
    userEvent.click(submitButton);

    encounterSequenceInput = getByRole("textbox", {
      name: "Encounter sequence *",
    });

    await waitFor(() => {
      expect(submitButton).not.toHaveFocus();
      expect(encounterSequenceInput).toHaveFocus();
    });
  });

  it("shows an error when best estimate is lower than low estimate", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, getByText } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={mockEncounterValues}
      />
    );

    const lowEstimateInput = getByRole("spinbutton", {
      name: "Low estimate",
    });
    await userEvent.type(lowEstimateInput, "200", { delay: 1 });

    const bestEstimateInput = getByRole("spinbutton", {
      name: "Best estimate",
    });
    await userEvent.type(bestEstimateInput, "100", { delay: 1 });

    userEvent.tab();

    await waitFor(() => {
      const errorMessage = getByText("Value must be less than or equal to 100");

      expect(errorMessage).toBeInTheDocument();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });
  });

  it("shows an error when high estimate is lower than best estimate", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, getByText } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={mockEncounterValues}
      />
    );

    const bestEstimateInput = getByRole("spinbutton", {
      name: "Best estimate",
    });
    await userEvent.type(bestEstimateInput, "200", { delay: 1 });

    const highEstimateInput = getByRole("spinbutton", {
      name: "High estimate",
    });
    await userEvent.type(highEstimateInput, "100", { delay: 1 });

    userEvent.tab();

    await waitFor(() => {
      const errorMessage = getByText("Value must be less than or equal to 100");

      expect(errorMessage).toBeInTheDocument();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });
  });

  it("shows an error when encounter is longer than 72 hours", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, getByLabelText } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={{
          ...mockEncounterValues,
          endTimestamp: new Date("2020-05-10T00:00:00.000Z"),
        }}
      />
    );

    await act(async () => {
      const timeInput = getByRole("textbox", { name: "End time" });
      changeInputMaskValue(timeInput, "1800");

      const saveAndEndButton = getByRole("button", { name: "Save & End" });
      userEvent.click(saveAndEndButton);
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_END_TIME
    );

    await waitFor(() => {
      const errorMessage = getByLabelText("elapsedTime", {
        selector: '[role="alert"]',
      });
      expect(errorMessage).toHaveTextContent(expectedErrorMessage);
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });
  });

  it("displays a confirmation modal when user makes changes to the form and presses the Cancel button", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, queryByTestId } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={mockEncounterValues}
      />
    );

    await act(async () => {
      const commentsInput = getByRole("textbox", {
        name: "Comments / Observations (names of underwater observers)",
      });
      await userEvent.type(commentsInput, "Test comment", { delay: 1 });

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
        initialValues={mockEncounterValues}
      />
    );

    await act(async () => {
      const cancelButton = getByRole("button", { name: "Cancel" });
      userEvent.click(cancelButton);
    });

    expect(queryByTestId("cancel-confirmation-modal")).not.toBeInTheDocument();
  });

  it("displays 'Save & End' button if encounter hasn't ended", async () => {
    const mockHandleSubmit = jest.fn();
    const { findByRole } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={mockEncounterValues}
      />
    );

    expect(await findByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      await findByRole("button", { name: "Save & End" })
    ).toBeInTheDocument();
  });

  it("doesn't display 'save and end' button if encounter has already ended", async () => {
    const mockHandleSubmit = jest.fn();
    const { findByRole, queryByRole } = render(
      <EncounterForm
        handleSubmit={mockHandleSubmit}
        initialValues={{ ...mockEncounterValues, hasEnded: true }}
      />
    );

    expect(await findByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      queryByRole("button", { name: "Save & End" })
    ).not.toBeInTheDocument();
  });

  it("has a comment field with maxlength 1000 chars", async () => {
    await act(async () => {
      const { getByRole } = render(<EncounterForm />);
      const commentsInput = getByRole("textbox", {
        name: "Comments / Observations (names of underwater observers)",
      });
      expect(commentsInput.maxLength).toBe(1000);
    });
  });
});
