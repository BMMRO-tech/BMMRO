/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderWithinFormik from "../../../../testUtils/renderWithinFormik";
import TimeInput from "../TimeInput";
import { FormErrorType } from "../../../../constants/forms";
import getFieldErrorMessage from "../../getFieldErrorMessage";
import TestUtils from "react-dom/test-utils";

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
      <TimeInput name="favoriteTime" labelText="Your favorite time" />,
      { favoriteTime: "" }
    );

    const timeInput = getByRole("textbox", { name: "Your favorite time" });
    await act(async () => {
      changeInputMaskValue(timeInput, "1800");
    });
    expect(getFormValues().favoriteTime).toEqual("18:00");
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

    const expectedErrorMessage = getFieldErrorMessage(
      FormErrorType.INVALID_TIME_FORMAT,
      { format: "hh:mm" }
    );
    expect(getFormErrors().favoriteTime).toEqual(expectedErrorMessage);

    expect(getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("autofills time", () => {
    const { getFormValues } = renderWithinFormik(
      <TimeInput name="defaultTime" labelText="Your favorite time" autofill />,
      { defaultTime: "" }
    );

    expect(getFormValues().defaultTime).toEqual("11:30");
  });
});
