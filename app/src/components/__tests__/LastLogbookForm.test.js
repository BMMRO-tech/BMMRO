import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { configure } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import LastLogbookForm from "../LastLogbookForm";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";

configure({ asyncUtilTimeout: 40000 });

describe("LastLogbookForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:12.000Z").getTime()
    );
  });

  it("trip miles are saved as a logbook comment", async () => {
    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };

    renderWithMockContexts(<LastLogbookForm handleSubmit={mockHandleSubmit} tripDate={new Date("2020-05-04T11:30:12.000Z")}/>);
    const submitButton = await waitFor(() =>
      screen.getByText("Save & Continue")
    );

    const tripMilesInput = await waitFor(() =>
      screen.getByRole("spinbutton", { name: "Trip miles" })
    );

    userEvent.clear(tripMilesInput);
    await userEvent.type(tripMilesInput, "5", { delay: 1 });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(formValues.logbookComments).toEqual("trip miles: 5");
    });
  });
});
