import React from "react";
import {
  render,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react/pure";

import HabitatUseForm from "../HabitatUseForm";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import numericFields from "../../forms/habitatUse/testCases/numericFields.json";
import textFields from "../../forms/habitatUse/testCases/textFields.json";
import selectFields from "../../forms/habitatUse/testCases/selectFields.json";
import timeFields from "../../forms/habitatUse/testCases/timeFields.json";

describe("Habitat Use Form validation", () => {
  const testFieldInput = (testDescription, fieldId, testCase) => {
    it(testDescription, async () => {
      const form = render(
        <FirebaseContext.Provider value={{}}>
          <HabitatUseForm />
        </FirebaseContext.Provider>
      );
      const inputField = form.queryByTestId(fieldId);

      await waitFor(() => {
        fireEvent.change(inputField, {
          target: { value: testCase.value },
        });
        fireEvent.blur(inputField);
      });

      const inputValue =
        inputField.type == "number" && !!testCase.value
          ? parseFloat(inputField.value)
          : inputField.value;
      expect(inputValue).toBe(testCase.value);

      if (!!testCase.error) {
        const error = form.queryByTestId(`error-${testCase.error}-${fieldId}`);
        expect(error).toBeInTheDocument();
      } else {
        const error = form.queryByTestId("error", {
          exact: false,
        });
        expect(error).not.toBeInTheDocument();
      }
    });
  };

  describe("Select field", () => {
    afterEach(() => cleanup());

    selectFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          const valueDescription = !!testCase.value
            ? `value ${testCase.value}`
            : "empty value";
          const testDescription = `Should have error of type '${testCase.error}' for ${valueDescription}`;

          testFieldInput(testDescription, field.id, testCase);
        });
      });
    });
  });

  describe("Numeric field", () => {
    afterEach(() => cleanup());

    numericFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          const valueDescription = !!testCase.value
            ? `value ${testCase.value}`
            : "empty value";
          const testDescription = `Should have error of type '${testCase.error}' for ${valueDescription}`;

          testFieldInput(testDescription, field.id, testCase);
        });
      });
    });
  });

  describe("Text field", () => {
    afterEach(() => cleanup());

    textFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          const valueDescription = !!testCase.value
            ? `text ${testCase.value.length} characters long`
            : "empty value";
          const testDescription = `Should have error of type '${testCase.error}' for ${valueDescription}`;
          testFieldInput(testDescription, field.id, testCase);
        });
      });
    });
  });

  describe("Time field", () => {
    let originalDateNow;
    beforeAll(() => {
      originalDateNow = Date.now;
      const today = "2020-05-04T15:30:00.000Z";
      global.Date.now = jest.fn(() => new Date(today).getTime());
    });

    afterAll(() => (Date.now = originalDateNow));
    afterEach(() => cleanup());

    timeFields.forEach((field) => {
      describe(field.id, () => {
        field.testCases.forEach((testCase) => {
          const valueDescription = !!testCase.value
            ? `value ${testCase.value}`
            : "empty value";
          const testDescription = `Should have error of type '${testCase.error}' for ${valueDescription}`;
          testFieldInput(testDescription, field.id, testCase);
        });
      });
    });
  });

  describe("Autofill", () => {
    const startTime = "11:30";

    const latitude = 1.123456;
    const latitudeActual = "1.123456";
    const longitude = 1.12345;
    const longitudeActual = "1.123450";

    let habitatUseForm;
    beforeAll(() => {
      global.Date.now = jest.fn(() =>
        new Date(`2020-05-04T11:30:00.000Z`).getTime()
      );

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

      habitatUseForm = render(
        <FirebaseContext.Provider value={{}}>
          <HabitatUseForm />
        </FirebaseContext.Provider>
      );
    });
    afterAll(() => cleanup());

    it("startTime should be autofilled", async () => {
      const startTimeField = habitatUseForm.queryByTestId("startTime");
      expect(startTimeField.value).toBe(startTime);
    });

    it("latitude should be autofilled", async () => {
      const latitudeField = habitatUseForm.queryByTestId("latitude");
      expect(latitudeField.value).toBe(latitudeActual);
    });

    it("longitude should be autofilled", async () => {
      const longitudeField = habitatUseForm.queryByTestId("longitude");
      expect(longitudeField.value).toBe(longitudeActual);
    });
  });
});
