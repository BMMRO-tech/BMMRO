import React from "react";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EncounterForm from "../EncounterForm";

describe("EncounterForm", () => {
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
    const { getByRole } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const areaInput = getByRole("combobox", { name: "Area *" });
      const speciesInput = getByRole("combobox", { name: "Species *" });
      const encounterSequenceInput = getByRole("textbox", {
        name: "Encounter sequence *",
      });
      const submitButton = getByRole("button");

      await userEvent.selectOptions(areaInput, "Central Andros");
      await userEvent.selectOptions(speciesInput, "Fin whale");
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

  it("displays error and doesn't submit the form if required fields are not completed", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole, getByLabelText } = render(
      <EncounterForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const submitButton = getByRole("button");
      userEvent.click(submitButton);

      const errorMessage = getByLabelText("Area", {
        selector: '[role="alert"]',
      });
      expect(errorMessage).not.toBeNull();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });
  });
});
