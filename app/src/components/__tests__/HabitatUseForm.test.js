import React from "react";
import { render, wait, fireEvent, cleanup } from "@testing-library/react/pure";
import user from "@testing-library/user-event";
import { addDays, format } from "date-fns";

import HabitatUseForm from "../HabitatUseForm";
import { DatastoreContext } from "../../App";
import { DATE_FORMAT, TIME_FORMAT } from "../../forms/constants";

describe("Habitat Use Form validation", () => {
  const insertInputAndBlur = async (inputField, value) => {
    await wait(async () => {
      user.click(inputField);
      await user.type(inputField, value);
      user.tab();
    });
  };

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

    afterAll(() => cleanup());

    testCases.forEach((testCase) => {
      it(`${testCase} should display an error when input is empty`, async () => {
        const error = habitatUseForm.queryByTestId(`error-empty-${testCase}`);
        expect(error).toBeInTheDocument();
      });
    });
  });

  describe("Min and max value validation", () => {
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
    ];

    testCases.forEach((testCase) => {
      describe(testCase.id, () => {
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

        afterEach(() => cleanup());

        it(`should display no error when value is between ${testCase.minValue}-${testCase.maxValue}`, async () => {
          const value = (testCase.maxValue - 1).toString();
          await insertInputAndBlur(inputField, value);
          const error = habitatUseForm.queryByTestId("error", {
            exact: false,
          });

          expect(error).not.toBeInTheDocument();
          expect(inputField.value).toBe(value);
        });

        it(`should display an error when input number is below minimum value of ${testCase.minValue}`, async () => {
          const value = (testCase.minValue - 10).toString();
          await insertInputAndBlur(inputField, value);
          const error = habitatUseForm.queryByTestId(
            `error-min-value-${testCase.id}`
          );

          expect(error).toBeInTheDocument();
        });

        it(`should display an error when input number is above maximum value of ${testCase.maxValue}`, async () => {
          const value = (testCase.maxValue + 10).toString();
          await insertInputAndBlur(inputField, value);
          const error = habitatUseForm.queryByTestId(
            `error-max-value-${testCase.id}`
          );

          expect(error).toBeInTheDocument();
        });
      });
    });
  });

  describe("Date validation", () => {
    let habitatUseForm;
    let inputField;

    beforeEach(() => {
      habitatUseForm = render(
        <DatastoreContext.Provider value={{}}>
          <HabitatUseForm />
        </DatastoreContext.Provider>
      );
      inputField = habitatUseForm.queryByTestId("date");
    });

    afterEach(() => {
      cleanup();
    });

    it("should display no error when date value is the current day or in the past", async () => {
      await insertInputAndBlur(inputField, "05/03/2020");
      const error = habitatUseForm.queryByTestId("error", {
        exact: false,
      });

      expect(inputField.value).toBe("05/03/2020");
      expect(error).not.toBeInTheDocument();
    });

    it("should display an error when the date is in the future", async () => {
      const originalDateNow = Date.now;
      const today = "2020-05-04T00:00:00.000Z";

      global.Date.now = jest.fn(() => new Date(today).getTime());

      const tomorrow = addDays(new Date(Date.now()), 1);
      const value = format(tomorrow, DATE_FORMAT);

      await insertInputAndBlur(inputField, value);
      const error = habitatUseForm.queryByTestId("error-max-date-date");

      expect(inputField.value).toBe("05/05/2020");
      expect(error).toBeInTheDocument();
      Date.now = originalDateNow;
    });

    it(`should display an error when the date not in the format ${DATE_FORMAT}`, async () => {
      await insertInputAndBlur(inputField, "2020-03-05");
      const error = habitatUseForm.queryByTestId(
        "error-invalid-date-format-date"
      );

      expect(inputField.value).toBe("2020-03-05");
      expect(error).toBeInTheDocument();
    });
  });

  describe("Time validation", () => {
    const testCases = ["startTime", "endTime"];

    testCases.forEach((testCase) => {
      describe(testCase, () => {
        let habitatUseForm;
        let dateField;

        beforeEach(() => {
          habitatUseForm = render(
            <DatastoreContext.Provider value={{}}>
              <HabitatUseForm />
            </DatastoreContext.Provider>
          );
          dateField = habitatUseForm.queryByTestId("date");
        });

        afterEach(() => {
          cleanup();
        });

        it("should display no error when time value is the current time or in the past", async () => {
          const timeField = habitatUseForm.queryByTestId(testCase);
          const curTime = format(new Date(), TIME_FORMAT);
          await insertInputAndBlur(timeField, curTime);
          const error = habitatUseForm.queryByTestId("error", {
            exact: false,
          });

          expect(timeField.value).toBe(curTime);
          expect(error).not.toBeInTheDocument();
        });

        it("should display an error when the time is in the future", async () => {
          const originalTimeNow = global.Date.now;
          const timeField = habitatUseForm.queryByTestId(testCase);
          const today = "2020-05-04T12:30:00.000Z";

          global.Date.now = jest.fn(() => new Date(today).getTime());

          const tomorrow = addDays(new Date(Date.now()), 1);
          const dateValue = format(tomorrow, DATE_FORMAT);

          await insertInputAndBlur(dateField, dateValue);
          await insertInputAndBlur(timeField, "12:30");
          const error = habitatUseForm.queryByTestId(
            `error-max-time-${testCase}`
          );

          expect(dateField.value).toBe("05/05/2020");
          expect(timeField.value).toBe("12:30");
          expect(error).toBeInTheDocument();
          global.Date.now = originalTimeNow;
        });

        it(`should display an error when the date not in the format ${TIME_FORMAT}`, async () => {
          const timeField = habitatUseForm.queryByTestId(testCase);
          await insertInputAndBlur(timeField, "22:30:04");
          const error = habitatUseForm.queryByTestId(
            `error-invalid-time-format-${testCase}`
          );

          expect(timeField.value).toBe("22:30:04");
          expect(error).toBeInTheDocument();
        });

        if (testCase === "endTime") {
          it("should display an error when end time is before start time", async () => {
            const originalTimeNow = global.Date.now;
            const startTimeField = habitatUseForm.queryByTestId("startTime");
            const endTimeField = habitatUseForm.queryByTestId("endTime");
            const today = "2030-07-23T15:00:00.000Z";

            global.Date.now = jest.fn(() => new Date(today).getTime());

            await insertInputAndBlur(startTimeField, "9:30");
            await insertInputAndBlur(endTimeField, "9:00");
            const error = habitatUseForm.queryByTestId(
              `error-start-time-after-end-time-${testCase}`
            );

            expect(startTimeField.value).toBe("9:30");
            expect(endTimeField.value).toBe("9:00");
            expect(error).toBeInTheDocument();
            global.Date.now = originalTimeNow;
          });
        }
      });
    });
  });

  describe("Position validation", () => {
    const testCases = [
      { minValue: -90, maxValue: 90, id: "latitude" },
      { minValue: -180, maxValue: 180, id: "longitude" },
    ];

    testCases.forEach((testCase) => {
      describe(testCase.id, () => {
        let habitatUseForm;
        let inputField;
        const mockPosition = "23.123456";

        beforeEach(() => {
          const mockGeolocation = {
            getCurrentPosition: jest.fn().mockImplementation((success) =>
              success({
                coords: {
                  latitude: mockPosition,
                  longitude: mockPosition,
                },
              })
            ),
          };
          global.navigator.geolocation = mockGeolocation;

          habitatUseForm = render(
            <DatastoreContext.Provider value={{}}>
              <HabitatUseForm />
            </DatastoreContext.Provider>
          );
          inputField = habitatUseForm.queryByTestId(testCase.id);
        });

        afterEach(() => cleanup());

        it(`should display no error when input value is within the range from ${testCase.minValue} to ${testCase.maxValue} and has 6 decimal digits`, async () => {
          const value = (testCase.minValue + 0.111111).toString();
          await insertInputAndBlur(inputField, value);
          const error = habitatUseForm.queryByTestId("error", {
            exact: false,
          });

          expect(error).not.toBeInTheDocument();
        });

        it(`should display an error when input number is below minimum value of ${testCase.minValue}`, async () => {
          const value = (testCase.minValue - 0.000001).toString();
          await insertInputAndBlur(inputField, value);
          const error = habitatUseForm.queryByTestId(
            `error-min-value-${testCase.id}`
          );

          expect(error).toBeInTheDocument();
        });

        it(`should display an error when input number is above maximum value of ${testCase.maxValue}`, async () => {
          const value = (testCase.maxValue + 0.000001).toString();
          await insertInputAndBlur(inputField, value);
          const error = habitatUseForm.queryByTestId(
            `error-max-value-${testCase.id}`
          );

          expect(error).toBeInTheDocument();
        });

        it(`should display an error when input number has less than 6 decimal digits`, async () => {
          const value = (testCase.minValue + 0.00001).toString();
          await insertInputAndBlur(inputField, value);
          const error = habitatUseForm.queryByTestId(
            `error-invalid-position-format-${testCase.id}`
          );

          expect(error).toBeInTheDocument();
        });

        it(`should display an error when input number has more than 6 decimal digits`, async () => {
          const value = (testCase.minValue + 0.0000000001).toString();
          await insertInputAndBlur(inputField, value);
          const error = habitatUseForm.queryByTestId(
            `error-invalid-position-format-${testCase.id}`
          );

          expect(error).toBeInTheDocument();
        });
      });
    });
  });

  describe("Autofill validation", () => {
    const latitude = "47.123456";
    const longitude = "27.123456";
    const startTime = "11:30";
    const date = "04/05/2020";

    let habitatUseForm;
    beforeAll(() => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          success({
            coords: {
              latitude,
              longitude,
            },
          })
        ),
      };
      global.navigator.geolocation = mockGeolocation;

      global.Date.now = jest.fn(() =>
        new Date(`2020-05-04T${startTime}:00.000Z`).getTime()
      );

      habitatUseForm = render(
        <DatastoreContext.Provider value={{}}>
          <HabitatUseForm />
        </DatastoreContext.Provider>
      );
    });
    afterAll(() => cleanup());

    it("startTime should be autofilled", async () => {
      const startTimeField = habitatUseForm.queryByTestId("startTime");
      expect(startTimeField.value).toBe(startTime);
    });

    it("date should be autofilled", async () => {
      const dateField = habitatUseForm.queryByTestId("date");
      expect(dateField.value).toBe(date);
    });
  });
});
