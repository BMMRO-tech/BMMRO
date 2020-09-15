/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import ElapsedTime from "../ElapsedTime";

describe("ElapsedTime", () => {
  it("displays elapsed time and synchronizes it with form state", async () => {
    const { findByText, getFormValues } = renderWithinFormik(<ElapsedTime />, {
      elapsedTime: "",
      startTime: "11:00",
      endTime: "11:30",
      startTimestamp: new Date(Date.now()),
      endTimestamp: new Date(Date.now()),
    });

    const elapsedTimeText = await findByText("Elapsed time: 30 minutes");

    expect(elapsedTimeText).toBeInTheDocument();
    expect(getFormValues().elapsedTime).toEqual(30);
  });

  it("does not set elapsed time when time is invalid", async () => {
    let container;
    await act(async () => {
      container = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00",
        endTime: "11:__",
        startTimestamp: new Date(Date.now()),
        endTimestamp: new Date(Date.now()),
      });
    });
    const { findByText, getFormValues } = container;

    const elapsedTimeText = await findByText("Elapsed time: -- minutes");

    expect(elapsedTimeText).toBeInTheDocument();
    expect(getFormValues().elapsedTime).toEqual("");
  });

  it("does not set time when end time is before start time", async () => {
    let container;
    await act(async () => {
      container = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00",
        endTime: "10:59",
        startTimestamp: new Date(Date.now()),
        endTimestamp: new Date(Date.now()),
      });
    });
    const { getFormValues, findByText } = container;

    const elapsedTimeText = await findByText("Elapsed time: -- minutes");

    expect(elapsedTimeText).toBeInTheDocument();
    expect(getFormValues().elapsedTime).toEqual("");
  });
});
