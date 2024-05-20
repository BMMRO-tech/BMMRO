import React from "react";
import { act, getByRole, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TripForm from "../TripForm";
import * as getProjects from "../../hooks/getProjects";
import tripDefaultValues from "../../constants/tripDefaultValues";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
}));

describe("TripForm", () => {
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

  const mockTripValues = {
    ...tripDefaultValues,
    tripNumber: "123",
    vessel: "Sexy Lexy",
    date: new Date("2020-05-04T00:00:00.000Z"),
    time: "09:44",
  };

  it("submits the form with correct values if all required fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (_, values) => {
      formValues = values;
    };

    const { getByRole } = render(
      <TripForm
        handleSubmit={mockHandleSubmit}
        initialValues={{
          ...mockTripValues,
          tripNumber: "",
          vessel: "",
          gpsFileName: "",
        }}
      />
    );

    await act(async () => {
      const areaInput = getByRole("combobox", { name: "Area *" });
      const vesselInput = getByRole("combobox", { name: "Vessel *" });
      const tripNumberInput = getByRole("spinbutton", {
        name: "Trip number (of this boat) *",
      });
      const submitButton = getByRole("button", {
        name: "Save & Update",
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
    expect(formValues.time).toEqual("09:44");
  });

  it("displays error and doesn't submit the form if required fields are not completed", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, getByLabelText } = render(
      <TripForm
        handleSubmit={mockHandleSubmit}
        initialValues={{
          mockTripValues,
          tripNumber: "",
          vessel: "",
          gpsFileName: "",
        }}
      />
    );

    let errorMessage;

    await act(async () => {
      const submitButton = getByRole("button", {
        name: "Save & Update",
      });
      userEvent.click(submitButton);

      errorMessage = getByLabelText("Trip number (of this boat)", {
        selector: '[role="alert"]',
      });
    });

    expect(errorMessage).not.toBeNull();
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it("if there is an error, after pressing submit button, will focus on that input", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole } = render(
      <TripForm
        handleSubmit={mockHandleSubmit}
        initialValues={{ ...mockTripValues, tripNumber: "" }}
      />
    );

    let submitButton;
    let tripNumberInput;

    submitButton = getByRole("button", {
      name: "Save & Update",
    });
    userEvent.click(submitButton);

    tripNumberInput = getByRole("spinbutton", {
      name: "Trip number (of this boat) *",
    });

    await waitFor(() => {
      expect(submitButton).not.toHaveFocus();
      expect(tripNumberInput).toHaveFocus();
    });
  });

  it("displays a confirmation modal when user makes changes to the form and presses the Cancel button", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, queryByTestId } = render(
      <TripForm
        handleSubmit={mockHandleSubmit}
        initialValues={mockTripValues}
      />
    );

    await act(async () => {
      const tripNumberInput = getByRole("spinbutton", {
        name: "Trip number (of this boat) *",
      });
      await userEvent.type(tripNumberInput, "123", { delay: 1 });

      const cancelButton = getByRole("button", { name: "Cancel" });
      userEvent.click(cancelButton);
    });

    expect(queryByTestId("cancel-confirmation-modal")).toBeInTheDocument();
  });

  it("does not display a confirmation modal when user doesn't do any changes in the form and presses the Cancel button", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, queryByTestId } = render(
      <TripForm
        handleSubmit={mockHandleSubmit}
        initialValues={{
          mockTripValues,
          vessel: "",
        }}
      />
    );

    await act(async () => {
      const cancelButton = getByRole("button", { name: "Cancel" });
      userEvent.click(cancelButton);
    });

    expect(queryByTestId("cancel-confirmation-modal")).not.toBeInTheDocument();
  });

  it("Should retrieve the project list from firestore", async () => {
    let formValues;
    const mockHandleSubmit = (_, values) => {
      formValues = values;
    };

    const { getByRole } = render(
      <TripForm
        handleSubmit={mockHandleSubmit}
        initialValues={{
          ...mockTripValues,
          tripNumber: "",
          vessel: "",
          gpsFileName: "",
        }}
      />
    );

    await act(async () => {
      const project = getByRole("combobox", { name: "Project" });
      const areaInput = getByRole("combobox", { name: "Area *" });
      const vesselInput = getByRole("combobox", { name: "Vessel *" });
      const tripNumberInput = getByRole("spinbutton", {
        name: "Trip number (of this boat) *",
      });
      const submitButton = getByRole("button", {
        name: "Save & Update",
      });

      await userEvent.type(tripNumberInput, "123", { delay: 1 });

      userEvent.selectOptions(areaInput, "Central Andros");
      userEvent.selectOptions(vesselInput, "Chimo");
      userEvent.selectOptions(project, "project2");
      userEvent.click(submitButton);
    });

    expect(formValues.area).toEqual("Central Andros");
    expect(formValues.vessel).toEqual("Chimo");
    expect(formValues.tripNumber).toEqual(123);
    expect(formValues.project).toEqual("project2");
  });
});
