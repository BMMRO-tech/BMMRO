/** @jsx jsx */
import { jsx } from "@emotion/core";
import userEvent from "@testing-library/user-event";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import ElapsedTime from "../ElapsedTime";
import { act } from "react-dom/test-utils";

describe("ElapsedTime", () => {
  it("synchronizes field value with form state & autofills", async () => {
    let timeRender;

    await act(async () => {
      timeRender = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00",
        endTime: "11:30",
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
        endTime: "10:30",
      }).getFormValues;
    });

    expect(getFormValues().elapsedTime).toEqual("");
  });
});
