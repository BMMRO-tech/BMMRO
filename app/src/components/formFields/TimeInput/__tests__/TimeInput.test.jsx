/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestUtils from "react-dom/test-utils";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import TimeInput from "../TimeInput";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";

const changeInputMaskValue = (element, value) => {
  element.value = value;
  element.selectionStart = element.selectionEnd = value.length;
  TestUtils.Simulate.change(element);
  TestUtils.Simulate.keyUp(element, { key: "Enter", keyCode: 13, which: 13 });
};

describe("TimeInput", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date(`2020-05-04T11:30:00.000Z`).getTime()
    );
  });

  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TimeInput
        name="favoriteTime"
        labelText="Your favorite time"
        notBefore="15:00"
      />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    await act(async () => {
      changeInputMaskValue(timeInput, "1800");
    });

    expect(getFormValues().favoriteTime).toEqual("18:00");
  });

  it("does not display an error when field value is correct", async () => {
    const { getByRole, queryByRole } = renderWithinFormik(
      <TimeInput
        name="favoriteTime"
        labelText="Your favorite time"
        isRequired
      />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", {
      name: "Your favorite time",
    });

    await act(async () => {
      await userEvent.type(timeInput, "15:00", { delay: 1 });
      userEvent.tab();
    });

    expect(
      queryByRole("alert", { name: "Your favorite time" })
    ).not.toBeInTheDocument();
  });

  it("validates on invalid hour", async () => {
    const {
      getFormErrors,
      getByRole,
      getByText,
    } = renderWithinFormik(
      <TimeInput name="favoriteTime" labelText="Your favorite time" />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    await act(async () => {
      changeInputMaskValue(timeInput, "2561");
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_TIME_FORMAT,
      { format: "hh:mm" }
    );

    expect(getFormErrors().favoriteTime).toEqual(expectedErrorMessage);
    expect(getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("validates start time before end time", async () => {
    const {
      getFormErrors,
      getByRole,
      getByText,
    } = renderWithinFormik(
      <TimeInput
        name="defaultTime"
        labelText="Your favorite time"
        notBefore="15:30"
      />,
      { defaultTime: "15:00" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    await act(async () => {
      timeInput.selectionStart = timeInput.selectionEnd = "15:00".length;
      TestUtils.Simulate.change(timeInput);
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.START_TIME_AFTER_END_TIME
    );

    expect(getFormErrors().defaultTime).toEqual(expectedErrorMessage);
    expect(getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("validates time is not in the future", async () => {
    const {
      getFormErrors,
      getByRole,
      getByText,
    } = renderWithinFormik(
      <TimeInput
        name="defaultTime"
        labelText="Your favorite time"
        notInFuture
      />,
      { defaultTime: "15:00" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });
    await act(async () => {
      timeInput.selectionStart = timeInput.selectionEnd = "15:00".length;
      TestUtils.Simulate.change(timeInput);
    });

    const expectedErrorMessage = getErrorMessage(FormErrorType.TIME_IN_FUTURE);

    expect(getFormErrors().defaultTime).toEqual(expectedErrorMessage);
    expect(getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("sets form field state to empty string when value is __:__", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TimeInput name="favoriteTime" labelText="Your favorite time" />,
      { favoriteTime: "" }
    );
    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    await act(async () => changeInputMaskValue(timeInput, "1234"));

    expect(getFormValues().favoriteTime).toEqual("12:34");

    await act(async () => changeInputMaskValue(timeInput, ""));

    expect(getFormValues().favoriteTime).toEqual("");
    expect(getFormValues().favoriteTime).not.toEqual("__:__");
  });

  it("autofills time", () => {
    const { getFormValues } = renderWithinFormik(
      <TimeInput name="defaultTime" labelText="Your favorite time" autofill />,
      { defaultTime: "" }
    );

    expect(getFormValues().defaultTime).toEqual("11:30");
  });
});
