import React from "react";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import HabitatUseForm from "../HabitatUseForm";

describe("HabitatUseForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date(`2020-05-04T11:30:00.000Z`).getTime()
    );
  });

  it("submits the form with correct values if all required fields are completed", async () => {
    const realGeolocation = global.navigator.geolocation;

    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
          coords: {
            latitude: 1.123456,
            longitude: 1.123456,
          },
        })
      ),
    };

    let formValues;
    let collectionPath;
    const { getByRole } = renderWithMockContexts(
      <HabitatUseForm openEncounterPath="encounter/123" />,
      {
        datastore: {
          createSubDoc: (parentPath, _, values) => {
            collectionPath = parentPath;
            formValues = values;
          },
        },
      }
    );

    await act(async () => {
      const numberOfAnimalsInput = getByRole("spinbutton", {
        name: "Number of Animals",
      });
      const latitudeInput = getByRole("textbox", { name: "Lat *" });
      const submitButton = getByRole("button");

      userEvent.clear(numberOfAnimalsInput);
      await userEvent.type(numberOfAnimalsInput, "5", { delay: 1 });
      userEvent.clear(latitudeInput);
      await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
      userEvent.click(submitButton);
    });

    expect(collectionPath).toEqual("encounter/123");
    expect(formValues.latitude).toEqual("15.123456");
    expect(formValues.longitude).toEqual("1.123456");
    expect(formValues.startTime).toEqual("11:30");
    expect(formValues.numberOfAnimals).toEqual(5);
    expect(formValues.endTime).toEqual("");

    global.navigator.geolocation = realGeolocation;
  });

  it("displays error and doesn't submit the form if required fields are not completed", async () => {
    const mockCreateSubDoc = jest.fn();
    const { getByRole, getByLabelText } = renderWithMockContexts(
      <HabitatUseForm openEncounterPath="encounter/123" />,
      {
        datastore: {
          createSubDoc: mockCreateSubDoc,
        },
      }
    );

    await act(async () => {
      const submitButton = getByRole("button");
      userEvent.click(submitButton);

      const errorMessage = getByLabelText("Lat");
      expect(errorMessage).toHaveAttribute("role", "alert");
      expect(mockCreateSubDoc).not.toHaveBeenCalled();
    });
  });
});
