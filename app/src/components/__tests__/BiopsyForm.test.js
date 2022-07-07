import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import BiopsyForm from "../BiopsyForm";

import userEvent from "@testing-library/user-event";

describe("BiopsyForm", () => {
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
      <BiopsyForm handleSubmit={mockHandleSubmit} />
    );

    const speciesInput = getByRole("combobox", { name: "Species *" });
    const submitButton = getByRole("button", { name: "Save" });
    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });

    userEvent.selectOptions(speciesInput, "Fin whale");
    userEvent.clear(latitudeInput);
    await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
    userEvent.clear(longitudeInput);
    await userEvent.type(longitudeInput, "1.123456", { delay: 1 });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(formValues.species).toEqual("Fin whale");
      expect(formValues.dateTaken).toEqual(
        new Date("2020-05-04T11:30:12.000Z")
      );
      expect(formValues.timeTaken).toEqual("11:30:12");
      expect(formValues.latitude).toEqual("15.123456");
      expect(formValues.longitude).toEqual("-1.123456");
    });
  });

  it("submits the form with correct values if all fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };

    const { getByRole } = render(
      <BiopsyForm handleSubmit={mockHandleSubmit} />
    );

    const speciesInput = getByRole("combobox", { name: "Species *" });
    const attemptInput = getByRole("textbox", { name: "Attempt Number" });
    const samplerNameInput = getByRole("textbox", { name: "Sampler Name" });
    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });
    const gpsMarkInput = getByRole("textbox", { name: "GPS mark" });
    const totalSpecimensInput = getByRole("textbox", {
      name: "Total Specimens",
    });
    const submitButton = getByRole("button", { name: "Save" });

    userEvent.selectOptions(speciesInput, "Fin whale");
    await userEvent.type(attemptInput, "1", { delay: 1 });
    await userEvent.type(samplerNameInput, "Test Name", { delay: 1 });
    userEvent.clear(latitudeInput);
    await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
    userEvent.clear(longitudeInput);
    await userEvent.type(longitudeInput, "1.123456", { delay: 1 });
    userEvent.type(gpsMarkInput, "2");
    userEvent.type(totalSpecimensInput, "3");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(formValues.species).toEqual("Fin whale");
      expect(formValues.dateTaken).toEqual(
        new Date("2020-05-04T11:30:12.000Z")
      );
      expect(formValues.timeTaken).toEqual("11:30:12");
      expect(formValues.attempt).toEqual("1");
      expect(formValues.samplerName).toEqual("Test Name");
      expect(formValues.latitude).toEqual("15.123456");
      expect(formValues.longitude).toEqual("-1.123456");
      expect(formValues.gpsMark).toEqual("2");
      expect(formValues.totalSpecimens).toEqual("3");
    });
  });

  it("contains cancel button", async () => {
    const { queryByRole } = render(<BiopsyForm />);

    await waitFor(() => {
      expect(queryByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });
  });

  it("if there is an error, after pressing submit button, will focus on that input", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole } = render(
      <BiopsyForm handleSubmit={mockHandleSubmit} />
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

  it("displays the positionalValidationModal if no positional data is entered", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole, getByText } = render(
      <BiopsyForm handleSubmit={mockHandleSubmit} />
    );

    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });
    userEvent.clear(latitudeInput);
    userEvent.clear(longitudeInput);

    const speciesInput = getByRole("combobox", { name: "Species *" });
    userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText("No positional data present!")).toBeInTheDocument();
      expect(
        getByText("End biopsy without positional data?")
      ).toBeInTheDocument();
      expect(getByText("End biopsy")).toBeInTheDocument();
    });
  });
  it("displays the positionalValidationModal if no latitide data is entered", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole, getByText } = render(
      <BiopsyForm handleSubmit={mockHandleSubmit} />
    );

    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });
    userEvent.clear(latitudeInput);
    userEvent.clear(longitudeInput);
    await userEvent.type(longitudeInput, "-1.530266", { delay: 1 });

    const speciesInput = getByRole("combobox", { name: "Species *" });
    userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText("No positional data present!")).toBeInTheDocument();
      expect(
        getByText("End biopsy without positional data?")
      ).toBeInTheDocument();
      expect(getByText("End biopsy")).toBeInTheDocument();
    });
  });
  it("displays the positionalValidationModal if no longitide data is entered", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole, getByText } = render(
      <BiopsyForm handleSubmit={mockHandleSubmit} />
    );

    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });
    userEvent.clear(latitudeInput);
    userEvent.clear(longitudeInput);
    await userEvent.type(latitudeInput, "1.530266", { delay: 1 });

    const speciesInput = getByRole("combobox", { name: "Species *" });
    userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText("No positional data present!")).toBeInTheDocument();
      expect(
        getByText("End biopsy without positional data?")
      ).toBeInTheDocument();
      expect(getByText("End biopsy")).toBeInTheDocument();
    });
  });
  it("does not display the positionalValidationModal if GPS mark is entered", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole, queryByText } = render(
      <BiopsyForm handleSubmit={mockHandleSubmit} />
    );

    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });
    const gpsMark = getByRole("textbox", { name: "GPS mark" });
    userEvent.clear(latitudeInput);
    userEvent.clear(longitudeInput);
    await userEvent.type(gpsMark, "21", { delay: 1 });

    const speciesInput = getByRole("combobox", { name: "Species *" });
    userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        queryByText("No positional data present!")
      ).not.toBeInTheDocument();
      expect(
        queryByText("End biopsy without positional data?")
      ).not.toBeInTheDocument();
      expect(queryByText("End biopsy")).not.toBeInTheDocument();
    });
  });

  it("displays the positionalValidationModal if no positional data is entered", async () => {
    const mockHandleSubmit = jest.fn();
    const { getByRole, getByText } = render(
      <BiopsyForm handleSubmit={mockHandleSubmit} />
    );

    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });
    userEvent.clear(latitudeInput);
    userEvent.clear(longitudeInput);
    await userEvent.type(latitudeInput, "1.530266", { delay: 1 });

    const speciesInput = getByRole("combobox", { name: "Species *" });
    userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText("No positional data present!")).toBeInTheDocument();
      expect(
        getByText("End biopsy without positional data?")
      ).toBeInTheDocument();
      expect(getByText("End biopsy")).toBeInTheDocument();
    });
    const stayOnPageButton = getByRole("button", { name: "Stay on this page" });

    await userEvent.click(stayOnPageButton);

    await waitFor(() => {
      expect(stayOnPageButton).not.toHaveFocus();
      expect(latitudeInput).toHaveFocus();
    });
  });
});
