import { act, render, waitFor, queryAllByRole } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import NewEncounterForm from "../NewEncounterForm";

describe("NewEncounterForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:12.000Z").getTime()
    );
  });

  it("submits the form with correct values if all required fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };

    const { getByRole, getAllByRole } = render(
      <NewEncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const areaInput = getByRole("combobox", { name: "Area *" });
      const encounterSequenceInput = getByRole("textbox", {
        name: "Encounter sequence *",
      });
      const [submitButton] = getAllByRole("button");

      userEvent.selectOptions(areaInput, "Central Andros");
      await userEvent.type(encounterSequenceInput, "123", { delay: 1 });
      userEvent.click(submitButton);
    });

    expect(formValues.area).toEqual("Central Andros");
    expect(formValues.sequenceNumber).toEqual("123");
    expect(formValues.startTimestamp).toEqual(
      new Date("2020-05-04T00:00:00.000Z")
    );
    expect(formValues.startTime).toEqual("11:30");
  });

  it("displays error and doesn't submit the form if required fields are not completed", async () => {
    const mockHandleSubmit = jest.fn();

    const { getAllByRole, getByLabelText } = render(
      <NewEncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const [submitButton] = getAllByRole("button");
      userEvent.click(submitButton);

      const errorMessage = getByLabelText("Area", {
        selector: '[role="alert"]',
      });
      expect(errorMessage).not.toBeNull();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });
  });

  it("if there is an error, after pressing submit button, will focus on that input", async () => {
    const mockHandleSubmit = jest.fn();

    const { getAllByRole, getByRole } = render(
      <NewEncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const [submitButton] = getAllByRole("button");
      userEvent.click(submitButton);

      const encounterSequenceInput = getByRole("textbox", {
        name: "Encounter sequence *",
      });

      await waitFor(() => {
        expect(submitButton).not.toHaveFocus();
        expect(encounterSequenceInput).toHaveFocus();
      });
    });
  });
});
