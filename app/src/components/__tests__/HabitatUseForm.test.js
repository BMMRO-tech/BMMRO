import React from "react";
import { render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import HabitatUseForm from "../HabitatUseForm";

describe("HabitatUseForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date(`2020-05-04T11:30:00.000Z`).getTime()
    );

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
  });

  it("submits the form with correct values if all required fields are completed", async () => {
    let formValues;
    const { getByRole } = render(
      <FirebaseContext.Provider value={{}}>
        <HabitatUseForm
          encounterPath="encounter/123"
          handleSubmit={(values) => (formValues = values)}
        />
      </FirebaseContext.Provider>
    );

    await act(async () => {
      const numberOfAnimalsInput = getByRole("spinbutton", {
        name: "Number of Animals",
      });
      const latitudeInput = getByRole("textbox", { name: "Lat *" });
      const submitButton = getByRole("button");
      await userEvent.clear(numberOfAnimalsInput);
      await userEvent.type(numberOfAnimalsInput, "5", { delay: 1 });
      await userEvent.clear(latitudeInput);
      await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
      userEvent.click(submitButton);
    });

    expect(formValues.latitude).toEqual("15.123456");
    expect(formValues.longitude).toEqual("1.123456");
    expect(formValues.startTime).toEqual("11:30");
    expect(formValues.numberOfAnimals).toEqual(5);
    expect(formValues.endTime).toEqual("");
  });
});
