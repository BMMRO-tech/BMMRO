import React from "react";
import { render, wait, fireEvent, cleanup } from "@testing-library/react/pure";
import user from "@testing-library/user-event";

import HabitatUseForm from "../HabitatUseForm";
import { DatastoreContext } from "../../App";

describe("Habitat Use Form validation", () => {
  describe("Empty validation", () => {
    const testCases = [
      "numberOfAnimals",
      "numberOfCalves",
      "species",
      "numberOfBoats",
      "directionOfTravel",
      "encSeqNo",
      "waterDepth",
      "waterTemp",
      "bottomSubstrate",
      "cloudCover",
      "beaufortSeaState",
      "tideState",
      "behaviour",
      "swellWaveHeight",
      "distance",
      "bearing",
      "aspect",
      "groupCohesion",
      "groupComposition",
      "surfaceBout",
      "endTime",
      "startTime",
      "date",
      "latitude",
      "longitude",
    ];

    let habitatUseForm;

    beforeAll(async () => {
      habitatUseForm = render(
        <DatastoreContext.Provider value={{}}>
          <HabitatUseForm />
        </DatastoreContext.Provider>
      );

      const startTime = habitatUseForm.queryByTestId("startTime");
      const date = habitatUseForm.queryByTestId("date");
      const submitButton = habitatUseForm.queryByTestId("submit-button");

      await wait(async () => {
        fireEvent.change(startTime, { target: { value: null } });
        fireEvent.change(date, { target: { value: null } });
        user.click(submitButton);
      });
    });

    afterAll(() => {
      cleanup();
    });

    testCases.forEach((testCase) => {
      it(`${testCase} should display an error when input is empty`, async () => {
        const error = habitatUseForm.queryByTestId(`error-empty-${testCase}`);
        expect(error).toBeInTheDocument();
      });
    });
  });

  describe("MinMax validation", () => {
    const testCases = [
      { minValue: 0, maxValue: 99, id: "numberOfAnimals" },
      { minValue: 0, maxValue: 99, id: "numberOfCalves" },
      { minValue: 0, maxValue: 999, id: "numberOfBoats" },
      { minValue: 0, maxValue: 9999, id: "waterDepth" },
      { minValue: 0, maxValue: 9999, id: "distance" },
      { minValue: 0, maxValue: 360, id: "bearing" },
      { minValue: 0, maxValue: 360, id: "aspect" },
      { minValue: 15, maxValue: 40, id: "waterTemp" },
      { minValue: 0, maxValue: 99, id: "surfaceBout" },
      { minValue: -90, maxValue: 90, id: "latitude" },
      { minValue: -180, maxValue: 180, id: "longitude" },
    ];

    afterEach(() => {
      cleanup();
    });

    testCases.forEach((testCase) => {
      describe(`${testCase.id}`, () => {
        let habitatUseForm;
        let inputField;

        beforeEach(() => {
          habitatUseForm = render(
            <DatastoreContext.Provider value={{}}>
              <HabitatUseForm />
            </DatastoreContext.Provider>
          );

          inputField = habitatUseForm.queryByTestId(testCase.id);
        });

        it(`should output no error when value is between ${testCase.minValue}-${testCase.maxValue}`, async () => {
          const inputValue = (testCase.maxValue - 1).toString();

          await wait(async () => {
            user.click(inputField);
            await user.type(inputField, inputValue);
            user.tab();
          });

          const error = habitatUseForm.queryByTestId(`error-${testCase.id}`);

          expect(error).not.toBeInTheDocument();
          expect(inputField.value).toBe(inputValue);
        });

        it(`should display an error when input number is below minimum value of ${testCase.minValue}`, async () => {
          const inputValue = (testCase.minValue - 10).toString();

          await wait(async () => {
            user.click(inputField);
            await user.type(inputField, inputValue);
            user.tab();
          });

          const error = habitatUseForm.queryByTestId(
            `error-min-value-${testCase.id}`
          );

          expect(error).toBeInTheDocument();
        });

        it(`should display an error when input number is above maximum value of ${testCase.maxValue}`, async () => {
          const inputValue = (testCase.maxValue + 10).toString();

          await wait(async () => {
            user.click(inputField);
            await user.type(inputField, inputValue);
            user.tab();
          });

          const error = habitatUseForm.queryByTestId(
            `error-max-value-${testCase.id}`
          );

          expect(error).toBeInTheDocument();
        });
      });
    });
  });
});
