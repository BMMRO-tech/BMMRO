/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithinFormik from "../../../../testUtils/renderWithinFormik";
import NumberInput from "../NumberInput";
import { FormErrorType } from "../../../../constants/forms";
import getFieldErrorMessage from "../../getFieldErrorMessage";

describe("NumberInput", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <NumberInput name="favoriteNumber" labelText="Your favorite number" />,
      { favoriteNumber: "" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number",
    });
    await userEvent.type(numberInput, "55", { delay: 1 });

    expect(getFormValues().favoriteNumber).toEqual(55);
  });

  it("validates on max number", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <NumberInput
        name="favoriteNumber"
        labelText="Your favorite number"
        maxValue={5}
      />,
      { favoriteNumber: "" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number",
    });
    await act(async () => {
      await userEvent.type(numberInput, "100", { delay: 1 });
      userEvent.tab();
    });

    const expectedErrorMessage = getFieldErrorMessage(FormErrorType.MAX_VALUE, {
      value: 5,
    });

    expect(getFormErrors().favoriteNumber).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite number" })
    ).toHaveTextContent(expectedErrorMessage);
  });

  it("validates on min number", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <NumberInput
        name="favoriteNumber"
        labelText="Your favorite number"
        minValue={0}
      />,
      { favoriteNumber: "" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number",
    });
    await act(async () => {
      await userEvent.type(numberInput, "-5", { delay: 1 });
      userEvent.tab();
    });

    const expectedErrorMessage = getFieldErrorMessage(FormErrorType.MIN_VALUE, {
      value: 0,
    });

    expect(getFormErrors().favoriteNumber).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite number" })
    ).toHaveTextContent(expectedErrorMessage);
  });

  it("validates on integer value", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <NumberInput
        name="favoriteNumber"
        labelText="Your favorite number"
        isInteger
      />,
      { favoriteNumber: "" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number",
    });
    await act(async () => {
      await userEvent.type(numberInput, "10.345", { delay: 1 });
      userEvent.tab();
    });

    const expectedErrorMessage = getFieldErrorMessage(
      FormErrorType.INVALID_NUMBER_FORMAT
    );

    expect(getFormErrors().favoriteNumber).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite number" })
    ).toHaveTextContent(expectedErrorMessage);
  });

  it("validates empty inputs if set as required", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <NumberInput
        name="favoriteNumber"
        labelText="Your favorite number"
        isRequired
      />,
      { favoriteNumber: "" }
    );

    await act(async () => {
      const textInput = getByRole("spinbutton", {
        name: "Your favorite number *",
      });
      userEvent.click(textInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getFieldErrorMessage(FormErrorType.EMPTY);
    expect(getFormErrors().favoriteNumber).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite number" })
    ).toHaveTextContent(expectedErrorMessage);
  });
});
