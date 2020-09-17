/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";

import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";
import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import ElapsedTime from "../ElapsedTime";

describe("ElapsedTime", () => {
  it("displays elapsed time and synchronizes it with form state", async () => {
    const { findByText, getFormValues } = renderWithinFormik(<ElapsedTime />, {
      elapsedTime: "",
      startTime: "11:00",
      endTime: "11:30",
      startTimestamp: new Date("2020-01-01T00:00:00.000Z"),
      endTimestamp: new Date("2020-01-01T00:00:00.000Z"),
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
        startTimestamp: new Date("2020-01-01T00:00:00.000Z"),
        endTimestamp: new Date("2020-01-01T00:00:00.000Z"),
      });
    });
    const { findByText, getFormValues } = container;

    const elapsedTimeText = await findByText("Elapsed time: -- minutes");

    expect(elapsedTimeText).toBeInTheDocument();
    expect(getFormValues().elapsedTime).toEqual("");
  });

  it("does not set elapsed time when end time is before start time", async () => {
    let container;
    await act(async () => {
      container = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00",
        endTime: "10:59",
        startTimestamp: new Date("2020-01-01T00:00:00.000Z"),
        endTimestamp: new Date("2020-01-01T00:00:00.000Z"),
      });
    });
    const { getFormValues, findByText } = container;

    const elapsedTimeText = await findByText("Elapsed time: -- minutes");

    expect(elapsedTimeText).toBeInTheDocument();
    expect(getFormValues().elapsedTime).toEqual("");
  });

  it("fails validation if end date but not end time is filled", async () => {
    let container;
    await act(async () => {
      container = renderWithinFormik(<ElapsedTime />, {
        elapsedTime: "",
        startTime: "11:00",
        endTime: "",
        startTimestamp: new Date("2020-01-01T00:00:00.000Z"),
        endTimestamp: new Date("2020-01-01T00:00:00.000Z"),
      });
    });
    const { getFormValues, findByText, getFormErrors, getByRole } = container;

    const elapsedTimeText = await findByText("Elapsed time: -- minutes");
    const expectedErrorMessage = getErrorMessage(
      FormErrorType.CONDITIONALLY_REQUIRED,
      { first: "end date", second: "end time" }
    );

    expect(elapsedTimeText).toBeInTheDocument();
    expect(getFormValues().elapsedTime).toEqual("");
    expect(getFormErrors().elapsedTime).toEqual(expectedErrorMessage);
    expect(getByRole("alert", { name: "elapsedTime" })).toHaveTextContent(
      expectedErrorMessage
    );
  });
});
