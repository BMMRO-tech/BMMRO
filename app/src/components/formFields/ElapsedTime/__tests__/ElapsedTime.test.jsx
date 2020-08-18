/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "react-dom/test-utils";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import ElapsedTime from "../ElapsedTime";

describe("ElapsedTime", () => {
  it("synchronizes field value with form state & autofills", async () => {
    let timeRender;

    await act(async () => {
      timeRender = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00:05",
        endTime: "11:30:50",
        startTimestamp: new Date(Date.now()),
        endTimestamp: new Date(Date.now()),
      });
    });

    expect(timeRender.getFormValues().elapsedTime).toEqual(31);
    expect(timeRender.getFormErrors()).toEqual({});
  });

  it("does not set time when time is invalid", async () => {
    let getFormValues;

    await act(async () => {
      getFormValues = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00:11",
        endTime: "11:00:__",
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
        startTime: "11:00:55",
        endTime: "11:00:54",
        startTimestamp: new Date(Date.now()),
        endTimestamp: new Date(Date.now()),
      }).getFormValues;
    });

    expect(getFormValues().elapsedTime).toEqual("");
  });
});
