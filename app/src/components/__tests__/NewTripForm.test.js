import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import NewTripForm from "../NewTripForm";
import * as getProjects from "../../hooks/getProjects";

describe("NewTripForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:12.000Z").getTime()
    );
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    const mockProjectList = ["project1", "project2"];
    jest.spyOn(getProjects, "getProjects").mockResolvedValue(mockProjectList);
  });

  it("submits the form with correct values if all required fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };

    const { getByRole } = render(
      <NewTripForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const areaInput = getByRole("combobox", { name: "Area *" });
      const vesselInput = getByRole("combobox", { name: "Vessel *" });
      const tripNumberInput = getByRole("spinbutton", {
        name: "Trip number (of this boat) *",
      });
      const submitButton = getByRole("button", {
        name: "Save & Start Logbook",
      });

      userEvent.selectOptions(areaInput, "Central Andros");
      userEvent.selectOptions(vesselInput, "Chimo");
      await userEvent.type(tripNumberInput, "123", { delay: 1 });
      userEvent.click(submitButton);
    });

    expect(formValues.area).toEqual("Central Andros");
    expect(formValues.vessel).toEqual("Chimo");
    expect(formValues.tripNumber).toEqual(123);
    expect(formValues.gpsFileName).toEqual("20_0504Ch.txt");

    expect(formValues.date).toEqual(new Date("2020-05-04T00:00:00.000Z"));
    expect(formValues.time).toEqual("11:30");
  });

  it("displays error and doesn't submit the form if required fields are not completed", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, getByLabelText } = render(
      <NewTripForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const submitButton = getByRole("button", {
        name: "Save & Start Logbook",
      });
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

    const { getByRole } = render(
      <NewTripForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const submitButton = getByRole("button", {
        name: "Save & Start Logbook",
      });
      userEvent.click(submitButton);

      const tripNumberInput = getByRole("spinbutton", {
        name: "Trip number (of this boat) *",
      });

      await waitFor(() => {
        expect(submitButton).not.toHaveFocus();
        expect(tripNumberInput).toHaveFocus();
      });
    });
  });

  it("displays a confirmation modal when user presses the Cancel button", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, queryByTestId } = render(
      <NewTripForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const areaInput = getByRole("combobox", { name: "Area *" });
      userEvent.selectOptions(areaInput, "Central Andros");

      const cancelButton = getByRole("button", { name: "Cancel" });
      userEvent.click(cancelButton);
    });

    expect(queryByTestId("cancel-confirmation-modal")).toBeInTheDocument();
  });
});
