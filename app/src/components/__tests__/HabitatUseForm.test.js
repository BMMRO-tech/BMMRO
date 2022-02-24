import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HabitatUseForm from "../HabitatUseForm";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
}));

describe("HabitatUseForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:12.000Z").getTime()
    );
  });

  it("submits the form with correct values if all required fields are completed", async () => {
    const realGeolocation = global.navigator.geolocation;

    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
          coords: {
            latitude: 1.123456,
            longitude: 1.123456,
          },
        })
      ),
    };

    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };
    const { getByRole } = render(
      <HabitatUseForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const numberOfAnimalsInput = getByRole("spinbutton", {
        name: "Number of animals",
      });
      const latitudeInput = getByRole("spinbutton", { name: "Lat" });
      const submitButton = getByRole("button", { name: "End Habitat" });

      userEvent.clear(numberOfAnimalsInput);
      await userEvent.type(numberOfAnimalsInput, "5", { delay: 1 });
      userEvent.clear(latitudeInput);
      await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
      userEvent.click(submitButton);
    });

    expect(formValues.latitude).toEqual("15.123456");
    expect(formValues.longitude).toEqual("1.123456");
    expect(formValues.startTime).toEqual("11:30:12");
    expect(formValues.numberOfAnimals).toEqual(5);
    expect(formValues.endTime).toEqual("");

    global.navigator.geolocation = realGeolocation;
  });

  it("submits with correct values if initial values are passed", async () => {
    const mockInitialValues = {
      numberOfAnimals: 1,
      numberOfCalves: 3,
      numberOfBoats: 1,
      directionOfTravel: "N",
      comments: "Cool whale!",
      waterDepth: 22,
      waterDepthBeyondSoundings: false,
      waterTemp: 17,
      bottomSubstrate: "",
      cloudCover: "",
      beaufortSeaState: "",
      tideState: "",
      behaviour: "",
      swellWaveHeight: "",
      distance: "",
      bearing: "",
      aspect: "",
      groupCohesion: "",
      groupComposition: "",
      surfaceBout: 0,
      endTime: "",
      startTime: "12:30:33",
      latitude: "1.123456",
      longitude: "1.123456",
    };
    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };
    const { getByRole } = render(
      <HabitatUseForm
        handleSubmit={mockHandleSubmit}
        initialValues={mockInitialValues}
      />
    );

    await act(async () => {
      const submitButton = getByRole("button", { name: "Save" });
      userEvent.click(submitButton);
    });

    expect(formValues).toEqual(mockInitialValues);
  });

  it("if there is an error, after pressing submit button, will focus on that input", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole } = render(
      <HabitatUseForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const latInput = getByRole("spinbutton", {
        name: "Lat",
      });
      const submitButton = getByRole("button", { name: "End Habitat" });

      await userEvent.type(latInput, "0.111", { delay: 1 });

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toHaveFocus();
        expect(latInput).toHaveFocus();
      });
    });
  });

  it("displays a confirmation modal when user makes changes to the form and presses the Cancel button", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, queryByTestId } = render(
      <HabitatUseForm handleSubmit={mockHandleSubmit} />
    );

    await act(async () => {
      const numberOfAnimalsInput = getByRole("spinbutton", {
        name: "Number of animals",
      });
      userEvent.clear(numberOfAnimalsInput);
      await userEvent.type(numberOfAnimalsInput, "5", { delay: 1 });

      const cancelButton = getByRole("button", { name: "Cancel" });
      userEvent.click(cancelButton);
    });

    expect(queryByTestId("cancel-confirmation-modal")).toBeInTheDocument();
  });

  it("does not display a confirmation modal when user doesn't do any changes in the form and presses the Cancel button", async () => {
    const mockHandleSubmit = jest.fn();

    const { getByRole, queryByTestId } = render(
      <HabitatUseForm
        handleSubmit={mockHandleSubmit}
        initialValues={{
          waterDepth: 22,
          waterDepthBeyondSoundings: false,
          waterTemp: 17,
          surfaceBout: 0,
        }}
      />
    );

    await act(async () => {
      const cancelButton = getByRole("button", { name: "Cancel" });
      userEvent.click(cancelButton);
    });

    expect(queryByTestId("cancel-confirmation-modal")).not.toBeInTheDocument();
  });

  it("displays an 'end habitat' button when there are no initial values", async () => {
    const { findByRole, queryByRole } = render(<HabitatUseForm />);

    expect(
      await findByRole("button", { name: "End Habitat" })
    ).toBeInTheDocument();
    expect(queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
  });

  it("displays a 'save' button when there are initial values", async () => {
    const { findByRole, queryByRole } = render(
      <HabitatUseForm
        initialValues={{
          waterDepth: 22,
          waterDepthBeyondSoundings: false,
          waterTemp: 17,
          surfaceBout: 0,
        }}
      />
    );

    expect(await findByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      queryByRole("button", { name: "End Habitat" })
    ).not.toBeInTheDocument();
  });

  it("has a comment field with maxlength 1000 chars", async () => {
    await act(async () => {
      const { getByRole } = render(<HabitatUseForm />);
      const commentsInput = getByRole("textbox", {
        name: "Comments",
      });
      expect(commentsInput.maxLength).toBe(1000);
    });
  });
});
