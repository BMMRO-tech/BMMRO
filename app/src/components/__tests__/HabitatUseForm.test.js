import React from "react";
import { render, wait, fireEvent, cleanup } from "@testing-library/react/pure";
import user from "@testing-library/user-event";
import { addDays, format } from "date-fns";

import HabitatUseForm from "../HabitatUseForm";
import { DatastoreContext } from "../../App";
import { DATE_FORMAT, TIME_FORMAT } from "../../forms/constants";

describe("Habitat Use Form validation", () => {
  const assertOnFieldInput = async (fieldId, testCase) => {
    const form = render(
      <DatastoreContext.Provider value={{}}>
        <HabitatUseForm />
      </DatastoreContext.Provider>
    );
    const inputField = form.queryByTestId(fieldId);
    await wait(() => {
      fireEvent.change(inputField, { target: { value: testCase.value } });
      fireEvent.blur(inputField);
    });

    expect(inputField.value).toBe(testCase.value);

    if (!!testCase.error) {
      const error = form.queryByTestId(`error-${testCase.error}-${fieldId}`);
      expect(error).toBeInTheDocument();
    } else {
      const error = form.queryByTestId("error", {
        exact: false,
      });
      expect(error).not.toBeInTheDocument();
    }
  };

  describe("Select field", () => {
    const testCases = [
      "species",
      "directionOfTravel",
      "bottomSubstrate",
      "cloudCover",
      "beaufortSeaState",
      "tideState",
      "behaviour",
      "swellWaveHeight",
      "groupCohesion",
    ];

    let habitatUseForm;

    beforeAll(async () => {
      habitatUseForm = render(
        <DatastoreContext.Provider value={{}}>
          <HabitatUseForm />
        </DatastoreContext.Provider>
      );
      const submitButton = habitatUseForm.queryByTestId("submit-button");

      await wait(async () => {
        user.click(submitButton);
      });
    });

    afterAll(() => cleanup());

    testCases.forEach((testCase) => {
      it(`${testCase} should have error of type 'empty' for empty value`, async () => {
        const error = habitatUseForm.queryByTestId(`error-empty-${testCase}`);
        expect(error).toBeInTheDocument();
      });
    });
  });

  describe("Numeric field", () => {
    const fields = [
      {
        id: "encSeqNo",
        testCases: [{ value: "", error: "empty" }],
      },
      {
        id: "numberOfAnimals",
        testCases: [
          { value: "10", error: undefined },
          { value: "", error: "empty" },
          { value: "-1", error: "min-value" },
          { value: "100", error: "max-value" },
        ],
      },
      {
        id: "numberOfCalves",
        testCases: [
          { value: "10", error: undefined },
          { value: "", error: "empty" },
          { value: "-1", error: "min-value" },
          { value: "100", error: "max-value" },
        ],
      },
      {
        id: "numberOfBoats",
        testCases: [
          { value: "10", error: undefined },
          { value: "", error: "empty" },
          { value: "-1", error: "min-value" },
          { value: "1000", error: "max-value" },
        ],
      },
      {
        id: "waterDepth",
        testCases: [
          { value: "10", error: undefined },
          { value: "", error: "empty" },
          { value: "-1", error: "min-value" },
          { value: "10000", error: "max-value" },
        ],
      },
      {
        id: "distance",
        testCases: [
          { value: "10", error: undefined },
          { value: "", error: "empty" },
          { value: "-1", error: "min-value" },
          { value: "10000", error: "max-value" },
        ],
      },
      {
        id: "bearing",
        testCases: [
          { value: "10", error: undefined },
          { value: "", error: "empty" },
          { value: "-1", error: "min-value" },
          { value: "361", error: "max-value" },
        ],
      },
      {
        id: "aspect",
        testCases: [
          { value: "10", error: undefined },
          { value: "", error: "empty" },
          { value: "-1", error: "min-value" },
          { value: "361", error: "max-value" },
        ],
      },
      {
        id: "waterTemp",
        testCases: [
          { value: "16", error: undefined },
          { value: "", error: "empty" },
          { value: "14", error: "min-value" },
          { value: "41", error: "max-value" },
        ],
      },
      {
        id: "surfaceBout",
        testCases: [
          { value: "10", error: undefined },
          { value: "", error: "empty" },
          { value: "-1", error: "min-value" },
          { value: "100", error: "max-value" },
        ],
      },
      {
        id: "latitude",
        testCases: [
          { value: "1.123456", error: undefined },
          { value: "", error: "empty" },
          { value: "-91.123456", error: "min-value" },
          { value: "91.123456", error: "max-value" },
          { value: "10.12345", error: "invalid-position-format" },
          { value: "10.1234567", error: "invalid-position-format" },
        ],
      },
      {
        id: "longitude",
        testCases: [
          { value: "1.123456", error: undefined },
          { value: "", error: "empty" },
          { value: "-181.123456", error: "min-value" },
          { value: "181.123456", error: "max-value" },
          { value: "10.12345", error: "invalid-position-format" },
          { value: "10.1234567", error: "invalid-position-format" },
        ],
      },
    ];

    afterEach(() => cleanup());

    fields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          const valueDescription = !!testCase.value
            ? `value ${testCase.value}`
            : "empty value";
          const testDescription = `Should have error of type '${testCase.error}' for ${valueDescription}`;
          it(testDescription, async () => {
            await assertOnFieldInput(field.id, testCase);
          });
        });
      });
    });
  });

  describe("Text field", () => {
    const fields = [
      {
        id: "groupComposition",
        testCases: [
          { value: "x".repeat(101), error: "max-char-length" },
          { value: "x".repeat(50), error: undefined },
          { value: "", error: "empty" },
        ],
      },
      {
        id: "comments",
        testCases: [
          { value: "x".repeat(501), error: "max-char-length" },
          { value: "x".repeat(50), error: undefined },
        ],
      },
    ];

    afterEach(() => cleanup());

    fields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          const valueDescription = !!testCase.value
            ? `text ${testCase.value.length} characters long`
            : "empty value";
          const testDescription = `Should have error of type '${testCase.error}' for ${valueDescription}`;
          it(testDescription, async () => {
            await assertOnFieldInput(field.id, testCase);
          });
        });
      });
    });
  });

  describe("Date field", () => {
    const testCases = [
      { value: "05/03/2020", error: undefined },
      { value: "", error: "empty" },
      { value: "05/05/2020", error: "max-date" },
      { value: "2020-03-05", error: "invalid-date-format" },
    ];

    let originalDateNow;
    beforeAll(() => {
      originalDateNow = Date.now;
      const today = "2020-05-04T00:00:00.000Z";
      global.Date.now = jest.fn(() => new Date(today).getTime());
    });

    afterAll(() => (Date.now = originalDateNow));
    afterEach(() => cleanup());

    testCases.forEach((testCase) => {
      const valueDescription = !!testCase.value
        ? `value ${testCase.value}`
        : "empty value";
      const testDescription = `Should have error of type '${testCase.error}' for ${valueDescription}`;
      it(testDescription, async () => {
        await assertOnFieldInput("date", testCase);
      });
    });
  });

  describe("Time field", () => {
    const fields = [
      {
        id: "startTime",
        testCases: [
          { value: "14:30", error: undefined },
          { value: "", error: "empty" },
          { value: "19:30", error: "max-time" },
          { value: "15:30:50", error: "invalid-time-format" },
        ],
      },
      {
        id: "endTime",
        testCases: [
          { value: "15:30", error: undefined },
          { value: "", error: "empty" },
          { value: "19:30", error: "max-time" },
          { value: "12:30", error: "start-time-after-end-time" },
          { value: "15:30:50", error: "invalid-time-format" },
        ],
      },
    ];

    let originalDateNow;
    beforeAll(() => {
      originalDateNow = Date.now;
      const today = "2020-05-04T15:30:00.000Z";
      global.Date.now = jest.fn(() => new Date(today).getTime());
    });

    afterAll(() => (Date.now = originalDateNow));
    afterEach(() => cleanup());

    fields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          const valueDescription = !!testCase.value
            ? `value ${testCase.value}`
            : "empty value";
          const testDescription = `Should have error of type '${testCase.error}' for ${valueDescription}`;
          it(testDescription, async () => {
            await assertOnFieldInput(field.id, testCase);
          });
        });
      });
    });
  });

  describe("Autofill", () => {
    const startTime = "11:30";
    const date = "04/05/2020";

    let habitatUseForm;
    beforeAll(() => {
      global.Date.now = jest.fn(() =>
        new Date(`2020-05-04T11:30:00.000Z`).getTime()
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
