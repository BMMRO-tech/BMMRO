import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import BiopsyForm from "../BiopsyForm";
import { configure } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import * as time from "../../utils/time";

configure({ asyncUtilTimeout: 40000 });
jest.setTimeout(12000);
describe("BiopsyForm", () => {
  beforeEach(() => {
    jest
      .spyOn(time, "getCurrentDate")
      .mockReturnValue(
        new Date(
          new Date(
            new Date("2020-05-04T11:30:12.000Z").getTime()
          ).setMilliseconds(0)
        )
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
    const dartHitYesRadio = getByTestId("field-dartHit-Yes");
    const dartStuckYesRadio = getByTestId("field-dartStuck-Yes");
    const dartRetrievedNoRadio = getByTestId("field-dartRetrieved-No");
    const sampleTypeSkinAndBlubberRadio = getByLabelText("Skin & blubber");
    const photographerInitialsInput = getByRole("textbox", {
      name: "Photographer",
    });
    const videoTakenYesRadio = getByTestId("field-video-Yes");
    const sampleNumberInput = getByRole("textbox", { name: "Sample Number" });
    const whaleIdInput = getByRole("textbox", { name: "WhaleID" });
    const sexMaleRadio = getByTestId("field-sex-male");
    const whaleAgeRadio = getByTestId("field-age-juvenile");
    const projectorTypeCrossbowRadio = getByTestId(
      "field-projectorType-Crossbow"
    );
    const modelInput = getByRole("textbox", { name: "Model" });
    const tipLengthInput = getByTestId("field-tipLength");
    const rangeInput = getByTestId("field-range");
    const angleInput = getByTestId("field-angle");

    const groupBehaviourBeforeBiopsyInput = getByRole("textbox", {
      name: "Before Biopsy",
    });
    const groupBehaviourAfterBiopsyInput = getByRole("textbox", {
      name: "After Biopsy",
    });
    const otherObservationsInput = getByRole("textbox", {
      name: "Other Observations",
    });

    const specimenNumberInputForFirstSpecimen = getByTestId(
      "field-specimens.0.specimenNumber"
    );
    const sampleTypeInputForFirstSpecimen = getByTestId(
      "field-specimens.0.sampleType"
    );
    const storageTypeInputForFirstSpecimen = getByTestId(
      "field-specimens.0.storageType"
    );

    const specimenNumberInputForSecondSpecimen = getByTestId(
      "field-specimens.0.specimenNumber"
    );
    const sampleTypeInputForSecondSpecimen = getByTestId(
      "field-specimens.0.sampleType"
    );
    const storageTypeInputForSecondSpecimen = getByTestId(
      "field-specimens.0.storageType"
    );

    const reactionStrengthStrongRadio = getByTestId(
      "field-reactionStrength-Strong"
    );
    const extentAllAnimalsRadio = getByTestId("field-extent-All animals");

    const targetAnimalBreachCheckbox = getByTestId(
      "field-targetAnimalBehaviour.breach"
    );
    const nonTargetAnimalBreachCheckbox = getByTestId(
      "field-nonTargetAnimalBehaviour.breach"
    );

    const submitButton = getByRole("button", { name: "Save" });

    await userEvent.selectOptions(speciesInput, "Fin whale");
    await userEvent.type(attemptInput, "1", { delay: 1 });
    await userEvent.type(sampleNumberInput, "md0397", { delay: 1 });
    await userEvent.type(samplerNameInput, "Test Name", { delay: 1 });
    await userEvent.clear(latitudeInput);
    await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
    await userEvent.clear(longitudeInput);
    await userEvent.type(longitudeInput, "1.123456", { delay: 1 });
    await userEvent.type(gpsMarkInput, "2");
    await userEvent.type(specimenNumberInputForFirstSpecimen, "4", {
      delay: 1,
    });
    await userEvent.selectOptions(sampleTypeInputForFirstSpecimen, "Skin");
    await userEvent.selectOptions(storageTypeInputForFirstSpecimen, "-80");

    const addSpecimensInput = getByRole("button", { name: "Add Specimen +" });
    await userEvent.click(addSpecimensInput);

    await userEvent.type(specimenNumberInputForSecondSpecimen, "5", {
      delay: 1,
    });
    await userEvent.selectOptions(
      sampleTypeInputForSecondSpecimen,
      "Skin/Blubber"
    );
    await userEvent.selectOptions(storageTypeInputForSecondSpecimen, "-20");

    await userEvent.click(dartHitYesRadio);
    await userEvent.click(dartStuckYesRadio);
    await userEvent.click(dartRetrievedNoRadio);
    await userEvent.click(targetAnimalBreachCheckbox);
    await userEvent.click(reactionStrengthStrongRadio);
    await userEvent.click(extentAllAnimalsRadio);
    await userEvent.click(nonTargetAnimalBreachCheckbox);
    await userEvent.click(sampleTypeSkinAndBlubberRadio);

    await userEvent.type(photographerInitialsInput, "Test Initials", {
      delay: 1,
    });
    await userEvent.click(videoTakenYesRadio);

    await userEvent.type(groupBehaviourBeforeBiopsyInput, "C", { delay: 1 });
    await userEvent.type(groupBehaviourAfterBiopsyInput, "T", { delay: 1 });
    await userEvent.type(otherObservationsInput, "H", { delay: 1 });

    await userEvent.type(whaleIdInput, "whale id", { delay: 1 });
    await userEvent.click(sexMaleRadio);
    await userEvent.click(whaleAgeRadio);

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

    await userEvent.click(projectorTypeCrossbowRadio);
    await userEvent.type(modelInput, "15.12", { delay: 1 });
    await userEvent.type(tipLengthInput, "12.2", { delay: 1 });
    await userEvent.type(rangeInput, "20", { delay: 1 });
    await userEvent.type(angleInput, "90", { delay: 1 });

    await userEvent.click(submitButton);

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
      expect(formValues.dartHit).toEqual("Yes");
      expect(formValues.dartStuck).toEqual("Yes");
      expect(formValues.dartRetrieved).toEqual("No");
      expect(formValues.sampleType).toEqual("Skin & blubber");
      expect(formValues.sampleNumber).toEqual("md0397");
      expect(formValues.photographerInitials).toEqual("Test Initials");
      expect(formValues.video).toEqual("Yes");
      expect(formValues.whaleID).toEqual("whale id");
      expect(formValues.sex).toEqual("male");
      expect(formValues.age).toEqual("juvenile");
      expect(formValues.totalSpecimens).toEqual(2);
      expect(formValues.whaleSide).toEqual("Right");
      expect(formValues.dorsalHit).toEqual("Yes");
      expect(formValues.areaHit).toEqual("Upper Dorsal");
      expect(formValues.reactionStrength).toEqual("Strong");
      expect(formValues.extent).toEqual("All animals");
      expect(formValues.targetAnimalBehaviour.breach).toEqual(true);
      expect(formValues.targetAnimalBehaviour.dive).toEqual(false);
      expect(formValues.nonTargetAnimalBehaviour.breach).toEqual(true);
      expect(formValues.nonTargetAnimalBehaviour.dive).toEqual(false);
      expect(formValues.model).toEqual("15.12");
      expect(formValues.tipLength).toEqual(12.2);
      expect(formValues.range).toEqual(20);
      expect(formValues.angle).toEqual(90);
      expect(formValues.projectorType).toEqual("Crossbow");
      expect(formValues.groupBehaviourBeforeBiopsy).toEqual("C");
      expect(formValues.groupBehaviourAfterBiopsy).toEqual("T");
      expect(formValues.otherObservations).toEqual("H");
      expect(formValues.specimens[1].specimenNumber).toEqual("4");
      expect(formValues.specimens[1].sampleType).toEqual("Skin");
      expect(formValues.specimens[1].storageType).toEqual("-80");
      expect(formValues.specimens[0].specimenNumber).toEqual("5");
      expect(formValues.specimens[0].sampleType).toEqual("Skin/Blubber");
      expect(formValues.specimens[0].storageType).toEqual("-20");
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
      whaleId: "whale id",
      sex: "male",
      age: "juvenile",
      sampleType: "Skin",
      photographerInitials: "Test Initials",
      video: "Yes",
      species: "Sperm whale",
      samplerName: "Bruce Wayne",
      attempt: 4,
      dateTaken: "Thu Jul 14 2022 11:56:43 GMT+0100",
      timeTaken: "10:52:04",
      latitude: "1.234567",
      longitude: "-2.345678",
      gpsMark: 12,
      projectorType: "Crossbow",
      groupBehaviourBeforeBiopsy: "C",
      groupBehaviourAfterBiopsy: "T",
      otherObservations: "H",
      model: 12,
      tipLength: 15,
      range: 50,
      angle: 45,
      totalSpecimens: 3,
      targetAnimalBehaviour: {
        accelerated: true,
        shake: false,
        startle: false,
        tailSplash: false,
        tailSlap: false,
        lunge: false,
        breach: false,
        dive: true,
        porpoising: false,
        flight: false,
        prolongedFlight: false,
        directionChange: false,
      },
      nonTargetAnimalBehaviour: {
        accelerated: true,
        shake: false,
        startle: false,
        tailSplash: false,
        tailSlap: true,
        lunge: false,
        breach: false,
        dive: true,
        porpoising: false,
        flight: true,
        prolongedFlight: false,
        directionChange: true,
      },
      specimens: [
        {
          specimenNumber: "S1",
          sampleType: "Skin",
          storageType: "-80",
        },
        {
          specimenNumber: "S2",
          sampleType: "Skin",
          storageType: "-20",
        },
        {
          specimenNumber: "S3",
          sampleType: "Skin",
          storageType: "-20",
        },
      ],
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
    const submitButton = getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(formValues).toEqual(mockInitialValues);
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

    await userEvent.click(submitButton);

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
    await userEvent.clear(latitudeInput);
    await userEvent.clear(longitudeInput);

    const speciesInput = getByRole("combobox", { name: "Species *" });
    await userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);

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
    await userEvent.clear(latitudeInput);
    await userEvent.clear(longitudeInput);
    await userEvent.type(longitudeInput, "-1.530266", { delay: 1 });

    const speciesInput = getByRole("combobox", { name: "Species *" });
    await userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);

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
    await userEvent.clear(latitudeInput);
    await userEvent.clear(longitudeInput);
    await userEvent.type(latitudeInput, "1.530266", { delay: 1 });

    const speciesInput = getByRole("combobox", { name: "Species *" });
    await userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);

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
    await userEvent.clear(latitudeInput);
    await userEvent.clear(longitudeInput);
    await userEvent.type(gpsMark, "21", { delay: 1 });

    const speciesInput = getByRole("combobox", { name: "Species *" });
    await userEvent.selectOptions(speciesInput, "Fin whale");

    const submitButton = getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);

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

  describe("SpecimensTableSection", () => {
    it("adds new row when add specimen record button is clicked", async () => {
      const mockArray = [
        {
          specimenNumber: "",
          sampleType: "",
          storageType: "",
        },
      ];

      const { getByTestId, queryByTestId, getByRole } = render(<BiopsyForm />);

      const addSpecimensInput = getByRole("button", { name: "Add Specimen +" });
      await userEvent.click(addSpecimensInput);

      const specimenField0 = queryByTestId("field-specimens.0.specimenNumber");
      const specimenField1 = queryByTestId("field-specimens.1.specimenNumber");
      const specimenField2 = queryByTestId("field-specimens.2.specimenNumber");

      await waitFor(async () => {
        expect(specimenField0).toBeTruthy();
        expect(specimenField1).toBeTruthy();
        expect(specimenField2).toBeFalsy();
      });
    });
  });
});
