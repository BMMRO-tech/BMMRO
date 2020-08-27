/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import ElapsedTime from "../ElapsedTime";

describe("ElapsedTime", () => {
  it("synchronizes field value with form state & autofills", async () => {
    let timeRender;

    await act(async () => {
      timeRender = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00",
        endTime: "11:30",
        startTimestamp: new Date(Date.now()),
        endTimestamp: new Date(Date.now()),
      });
    });

    expect(timeRender.getFormValues().elapsedTime).toEqual(30);
    expect(timeRender.getFormErrors()).toEqual({});
  });

  it("does not set time when time is invalid", async () => {
    let getFormValues;

    await act(async () => {
      getFormValues = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00",
        endTime: "11:__",
        startTimestamp: new Date(Date.now()),
        endTimestamp: new Date(Date.now()),
      }).getFormValues;
    });

    expect(getFormValues().elapsedTime).toEqual("");
  });

  it("does not set time when end time is before start time", async () => {
    let getFormValues;
    await act(async () => {
      getFormValues = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00",
        endTime: "10:59",
        startTimestamp: new Date(Date.now()),
        endTimestamp: new Date(Date.now()),
      }).getFormValues;
    });

    expect(getFormValues().elapsedTime).toEqual("");
  });

  it("does not allow input when field is disabled", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <ElapsedTime isDisabled />,
      {
        elapsedTime: "",
      }
    );

    const elapsedTimeInput = getByRole("spinbutton", {
      name: "Elapsed time (mins)",
    });
    await userEvent.type(elapsedTimeInput, "12:20", { delay: 1 });

    expect(getFormValues().elapsedTime).toEqual("");
  });
});
