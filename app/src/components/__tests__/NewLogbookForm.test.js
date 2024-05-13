import React from "react";
import { act, render, waitFor, fireEvent } from "@testing-library/react";
import NewLogbookForm from "../NewLogbookForm";
import { configure } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

configure({ asyncUtilTimeout: 40000 });

describe("NewLogbookForm", () => {
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
      <NewLogbookForm handleSubmit={mockHandleSubmit} />
    );

    const submitButton = getByRole("button", { name: "Save" });
    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });

    userEvent.clear(latitudeInput);
    await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
    userEvent.clear(longitudeInput);
    await userEvent.type(longitudeInput, "1.123456", { delay: 1 });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(formValues.time).toEqual("11:30:12");
      expect(formValues.latitude).toEqual("15.123456");
      expect(formValues.longitude).toEqual("-1.123456");
    });
  });

  it("submits the form with correct values if all fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };

    const { getByRole, getByTestId, getByLabelText } = render(
      <NewLogbookForm handleSubmit={mockHandleSubmit} />
    );

    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });
    const gpsMarkInput = getByRole("textbox", { name: "GPS mark" });

    const submitButton = getByRole("button", { name: "Save" });

    userEvent.clear(latitudeInput);
    await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
    userEvent.clear(longitudeInput);
    await userEvent.type(longitudeInput, "1.123456", { delay: 1 });
    userEvent.type(gpsMarkInput, "2");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(formValues.time).toEqual("11:30:12");
      expect(formValues.latitude).toEqual("15.123456");
      expect(formValues.longitude).toEqual("-1.123456");
      expect(formValues.gpsMark).toEqual("2");
    });
  });

  it("submits with correct values if initial values are passed", async () => {
    const mockInitialValues = {
      time: "11:30:12",
      latitude: "1.234567",
      longitude: "-2.345678",
      gpsMark: 12,
      waterDepth: 22,
      waterDepthBeyondSoundings: false,
      waterTemp: 17,
      bottomSubstrate: "",
      cloudCover: "",
      beaufortSeaState: "",
      gpsMark: "",
      hydrophoneChecked: "",
      efforted: "",
      hydrophoneComments: "",
      logbookComments: "",
    };

    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };

    const { getByRole } = render(
      <NewLogbookForm
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

  it("contains cancel button", async () => {
    const { queryByRole } = render(<NewLogbookForm />);

    await waitFor(() => {
      expect(queryByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });
  });

  it("if there is an error, after pressing submit button, will focus on that input", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole } = render(
      <NewLogbookForm handleSubmit={mockHandleSubmit} />
    );

    const latInput = getByRole("spinbutton", {
      name: "Lat",
    });

    const submitButton = getByRole("button", { name: "Save" });

    await userEvent.type(latInput, "0.111", { delay: 1 });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toHaveFocus();
      expect(latInput).toHaveFocus();
    });
  });
});
