/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestUtils from "react-dom/test-utils";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import TimeInput from "../TimeInput";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";
import { changeInputMaskValue } from "../../../../utils/test/changeInputMaskValue";

describe("TimeInput", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:43.000Z").getTime()
    );
  });

  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TimeInput
        name="favoriteTime"
        labelText="Your favorite time"
        notBefore="15:00:00"
        timeWithSeconds
      />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    await act(async () => {
      changeInputMaskValue(timeInput, "180000");
    });

    expect(getFormValues().favoriteTime).toEqual("18:00:00");
  });

  it("does not display an error when field value is correct", async () => {
    const { getByRole, queryByRole } = renderWithinFormik(
      <TimeInput name="favoriteTime" labelText="Your favorite time" />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", {
      name: "Your favorite time",
    });

    await act(async () => {
      await userEvent.type(timeInput, "15:00:21", { delay: 1 });
      userEvent.tab();
    });

    expect(
      queryByRole("alert", { name: "Your favorite time" })
    ).not.toBeInTheDocument();
  });

  it("validates empty inputs if set as required", async () => {
    const { getByRole, getFormErrors } = renderWithinFormik(
      <TimeInput
        name="favoriteTime"
        labelText="Your favorite time"
        isRequired
      />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time *" });
    await act(async () => {
      await userEvent.type(timeInput, "", { delay: 1 });
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(FormErrorType.EMPTY);
    expect(getFormErrors().favoriteTime).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite time" })
    ).toHaveTextContent(expectedErrorMessage);
  });

  it("validates on invalid hour", async () => {
    const { getFormErrors, getByRole, getByText } = renderWithinFormik(
      <TimeInput
        name="favoriteTime"
        labelText="Your favorite time"
        timeWithSeconds
      />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    await act(async () => {
      changeInputMaskValue(timeInput, "256111");
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_TIME_FORMAT,
      { format: "hh:mm:ss" }
    );

    expect(getFormErrors().favoriteTime).toEqual(expectedErrorMessage);
    expect(getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("validates time is not before the notBefore date", async () => {
    const { getFormErrors, getByRole, getByText } = renderWithinFormik(
      <TimeInput
        name="defaultTime"
        labelText="Your favorite time"
        notBefore={new Date(Date.now())}
        associatedDate={new Date(Date.now())}
        timeWithSeconds
      />,
      { defaultTime: "11:29:11" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    await act(async () => {
      timeInput.selectionStart = timeInput.selectionEnd = "11:29:11".length;
      TestUtils.Simulate.change(timeInput);
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.END_TIME_BEFORE_START_TIME
    );

    expect(getFormErrors().defaultTime).toEqual(expectedErrorMessage);
    expect(getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("validates time is not after the notAfter date", async () => {
    const { getFormErrors, getByRole, getByText } = renderWithinFormik(
      <TimeInput
        name="defaultTime"
        labelText="Your favorite time"
        notAfter={new Date(Date.now())}
        associatedDate={new Date(Date.now())}
        timeWithSeconds
      />,
      { defaultTime: "11:31:13" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });
    await act(async () => {
      timeInput.selectionStart = timeInput.selectionEnd = "11:31:13".length;
      TestUtils.Simulate.change(timeInput);
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_END_TIME
    );

    expect(getFormErrors().defaultTime).toEqual(expectedErrorMessage);
    expect(getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("sets form field state to empty string when value is __:__:__", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TimeInput
        name="favoriteTime"
        labelText="Your favorite time"
        timeWithSeconds
      />,
      { favoriteTime: "" }
    );
    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    await act(async () => changeInputMaskValue(timeInput, "123456"));

    expect(getFormValues().favoriteTime).toEqual("12:34:56");

    await act(async () => changeInputMaskValue(timeInput, ""));

    expect(getFormValues().favoriteTime).toEqual("");
    expect(getFormValues().favoriteTime).not.toEqual("__:__:__");
  });

  it("sets form field state to empty string when value is __:__ and timeWithSeconds is false", async () => {
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

  it("autofills time without seconds when timeWithSeconds is false", () => {
    const { getFormValues } = renderWithinFormik(
      <TimeInput name="defaultTime" labelText="Your favorite time" autofill />,
      { defaultTime: "" }
    );

    expect(getFormValues().defaultTime).toEqual("11:30");
  });

  it("autofills time without seconds when timeWithSeconds is false", () => {
    const { getFormValues } = renderWithinFormik(
      <TimeInput
        name="defaultTime"
        labelText="Your favorite time"
        autofill
        timeWithSeconds
      />,
      { defaultTime: "" }
    );

    expect(getFormValues().defaultTime).toEqual("11:30:43");
  });

  it("does not allow input when field is disabled", async () => {
    const { getByRole } = renderWithinFormik(
      <TimeInput
        name="favoriteTime"
        labelText="Your favorite time"
        notBefore="15:00:00"
        timeWithSeconds
        isDisabled
      />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });

    expect(timeInput).toHaveAttribute("disabled");
  });
});
