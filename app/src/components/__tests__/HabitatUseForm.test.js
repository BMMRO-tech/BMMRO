import React from "react";
import { render, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
import HabitatUseForm from "../HabitatUseForm";
import { DatastoreContext } from "../../App";

describe("Habitat Use Validation", () => {
  const numberValidationCases = [
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

  numberValidationCases.forEach((testCase) => {
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

      it(`should output no error when input is valid`, async () => {
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

      it("should display an error when input is empty", async () => {
        await wait(async () => {
          user.click(input);
          user.tab();
        });
        const error = habitatUseForm.queryByTestId(`error-${testCase.id}`);

        expect(error).toBeInTheDocument();
        expect(error.innerHTML).toBe("Required");
      });

      it(`should display an error when input number is below minimum`, async () => {
        const inputValue = (testCase.minValue - 10).toString();

        await wait(async () => {
          user.click(input);
          await user.type(input, inputValue);
          user.tab();
        });

        const error = habitatUseForm.queryByTestId(`error-${testCase.id}`);

        expect(error).toBeInTheDocument();
        expect(error.innerHTML).toBe(
          `Input value should be between ${testCase.minValue} and ${testCase.maxValue}`
        );
      });

      it(`should display an error when input number is above maximum`, async () => {
        const inputValue = (testCase.maxValue + 10).toString();

        await wait(async () => {
          user.click(input);
          await user.type(input, inputValue);
          user.tab();
        });

        const error = habitatUseForm.queryByTestId(`error-${testCase.id}`);

        expect(error).toBeInTheDocument();
        expect(error.innerHTML).toBe(
          `Input value should be between ${testCase.minValue} and ${testCase.maxValue}`
        );
      });
    });
  });
});
