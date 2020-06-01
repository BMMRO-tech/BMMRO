import React from "react";
import { render, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
import HabitatUseForm from "../HabitatUseForm";
import { DatastoreContext } from "../../App";

describe("Habitat Use Form validation", () => {
  describe("Empty validation", () => {
    const requiredFields = [
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
      "latitude",
      "longitude",
    ];
    let habitatUseForm;
    beforeEach(async () => {
      habitatUseForm = render(
        <DatastoreContext.Provider value={{}}>
          <HabitatUseForm />
        </DatastoreContext.Provider>
      );
    });

    requiredFields.forEach((testCase) => {
      it(`${testCase} should display an error when input is empty`, async () => {
        const input = habitatUseForm.queryByTestId(testCase);
        await wait(async () => {
          if (testCase === "date" || testCase === "startTime") {
            await user.type(input, "");
          } else {
            user.click(input);
          }
          user.tab();
        });

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

    testCases.forEach((testCase) => {
      describe(`${testCase.id}`, () => {
        let habitatUseForm;
        let input;

        beforeEach(() => {
          habitatUseForm = render(
            <DatastoreContext.Provider value={{}}>
              <HabitatUseForm />
            </DatastoreContext.Provider>
          );

          input = habitatUseForm.queryByTestId(testCase.id);
        });

        it(`should output no error when value is between ${testCase.minValue}-${testCase.maxValue}`, async () => {
          const inputValue = (testCase.maxValue - 1).toString();

          await wait(async () => {
            user.click(input);
            await user.type(input, inputValue);
            user.tab();
          });

          const error = habitatUseForm.queryByTestId(`error-${testCase.id}`);

          expect(error).not.toBeInTheDocument();
          expect(input.value).toBe(inputValue);
        });

        it(`should display an error when input number is below minimum value of ${testCase.minValue}`, async () => {
          const inputValue = (testCase.minValue - 10).toString();

          await wait(async () => {
            user.click(input);
            await user.type(input, inputValue);
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
            user.click(input);
            await user.type(input, inputValue);
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
