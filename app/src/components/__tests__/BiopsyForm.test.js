import React from "react";
import { act, render, waitFor, fireEvent } from "@testing-library/react";
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

    const { getByRole, getByTestId, getByLabelText } = render(
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
    const dartHitYesRadio = getByTestId("field-dartHit-Yes");
    const dartStuckYesRadio = getByTestId("field-dartStuck-Yes");
    const dartRetrievedNoRadio = getByTestId("field-dartRetrieved-No");
    const sampleTypeSkinRadio = getByLabelText("Skin");

    const reactionStrengthStrongRadio = getByTestId(
      "field-reactionStrength-Strong"
    );
    const extentAllAnimalsRadio = getByTestId("field-extent-All animals");

    const targetAnimalBreachCheckbox = getByTestId("field-targetAnimalBehaviour.Breach");
    const nonTargetAnimalBreachCheckbox = getByTestId(
      "field-nonTargetAnimalBehaviour.Breach"
    );

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

    userEvent.click(dartHitYesRadio);
    userEvent.click(dartStuckYesRadio);
    userEvent.click(dartRetrievedNoRadio);
    userEvent.click(sampleTypeSkinRadio);
    userEvent.click(targetAnimalBreachCheckbox);
    userEvent.click(reactionStrengthStrongRadio);
    userEvent.click(extentAllAnimalsRadio);
    userEvent.click(nonTargetAnimalBreachCheckbox);

    fireEvent(
      getByTestId("Upper Dorsal"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    const sideHitRadio = getByLabelText("Right");
    fireEvent.click(sideHitRadio);

    const dorsalHitRadio = getByTestId("field-dorsalHit-Yes");
    fireEvent.click(dorsalHitRadio);

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
      expect(formValues.dartHit).toEqual("Yes");
      expect(formValues.dartStuck).toEqual("Yes");
      expect(formValues.dartRetrieved).toEqual("No");
      expect(formValues.sampleType).toEqual("Skin");
      expect(formValues.whaleSide).toEqual("Right");
      expect(formValues.dorsalHit).toEqual("Yes");
      expect(formValues.areaHit).toEqual("Upper Dorsal");
      expect(formValues.reactionStrength).toEqual("Strong");
      expect(formValues.extent).toEqual("All animals");
      expect(formValues.targetAnimalBehaviour.Breach).toEqual(true);
      expect(formValues.targetAnimalBehaviour.Dive).toEqual(false);
      expect(formValues.nonTargetAnimalBehaviour.Breach).toEqual(true);
      expect(formValues.nonTargetAnimalBehaviour.Dive).toEqual(false);
    });
  });

  it("submits with correct values if initial values are passed", async () => {
    const mockInitialValues = {
      areaHit: "Upper Dorsal",
      dorsalHit: "Yes",
      whaleSide: "Right",
      dartHit: "Yes",
      dartStuck: "Yes",
      dartRetrieved: "No",
      sampleType: "Skin",
      species: "Sperm whale",
      samplerName: "Bruce Wayne",
      attempt: 4,
      dateTaken: "Thu Jul 14 2022 11:56:43 GMT+0100",
      timeTaken: "10:52:04",
      latitude: "1.234567",
      longitude: "-2.345678",
      gpsMark: 12,
      totalSpecimens: 3,
      exported: false,
      hasEnded: false,
    };

    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };

    const { getByRole } = render(
      <BiopsyForm
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

  describe("Dart Hit Section", () => {
    it.each([
      ["Lower Peduncle"],
      ["Upper Peduncle"],
      ["Lower Dorsal"],
      ["Upper Dorsal"],
      ["Lower Thoracic"],
      ["Upper Thoracic"],
    ])(
      "displays correct area hit when corresponding section of the svg is clicked",
      async (val) => {
        const { queryByText, getByTestId } = render(<BiopsyForm />);

        fireEvent(
          getByTestId(val),
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          })
        );

        await waitFor(() => {
          expect(queryByText("Area Hit : " + val)).toBeInTheDocument();
        });
      }
    );

    it("contains left and right radio buttons", async () => {
      const { queryByText } = render(<BiopsyForm />);
      await waitFor(() => {
        expect(queryByText("Left")).toBeInTheDocument();
        expect(queryByText("Right")).toBeInTheDocument();
      });
    });

    it("contains option did it hit the fin when upper dorsal is selected", async () => {
      const { queryByText, getByTestId } = render(<BiopsyForm />);

      fireEvent(
        getByTestId("Upper Dorsal"),
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      );
      await waitFor(() => {
        expect(queryByText("Did it hit the fin?")).toBeInTheDocument();
      });
    });

    it("does not contain option did it hit the fin when a section other than upper dorsal is selected", async () => {
      const { queryByText, getByTestId } = render(<BiopsyForm />);

      fireEvent(
        getByTestId("Lower Dorsal"),
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      );
      await waitFor(() => {
        expect(queryByText("Did it hit the fin?")).not.toBeInTheDocument();
      });
    });
  });
});
