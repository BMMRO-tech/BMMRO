/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import NumberInput from "../NumberInput";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";

describe("NumberInput", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <NumberInput
        name="favoriteNumber"
        labelText="Your favorite number"
        minValue={1}
        maxValue={100}
      />,
      { favoriteNumber: "" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number",
    });
    await userEvent.type(numberInput, "55", { delay: 1 });

    expect(getFormValues().favoriteNumber).toEqual(55);
  });

  it("does not display an error when field value is correct", async () => {
    const { getByRole, queryByRole } = renderWithinFormik(
      <NumberInput
        name="favoriteNumber"
        labelText="Your favorite number"
        isRequired
      />,
      { favoriteNumber: "" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number *",
    });
    await act(async () => {
      await userEvent.type(numberInput, "100", { delay: 1 });
      userEvent.tab();
    });

    expect(
      queryByRole("alert", { name: "Your favorite number" })
    ).not.toBeInTheDocument();
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

    const expectedErrorMessage = getErrorMessage(FormErrorType.MAX_VALUE, {
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

    const expectedErrorMessage = getErrorMessage(FormErrorType.MIN_VALUE, {
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

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_NUMBER_FORMAT
    );

    expect(getFormErrors().favoriteNumber).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite number" })
    ).toHaveTextContent(expectedErrorMessage);
  });

  it("validates on decimal precision", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <NumberInput
        name="favoriteDecimalNumber"
        labelText="Your favorite decimal number"
        decimalPrecision={2}
      />,
      { favoriteDecimalNumber: "" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite decimal number",
    });
    await act(async () => {
      await userEvent.type(numberInput, "666.666", { delay: 1 });
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.MAX_DECIMAL_PLACES,
      { maxDecimalPlaces: 2 }
    );

    expect(getFormErrors().favoriteDecimalNumber).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite decimal number" })
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

    const expectedErrorMessage = getErrorMessage(FormErrorType.EMPTY);
    expect(getFormErrors().favoriteNumber).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite number" })
    ).toHaveTextContent(expectedErrorMessage);
  });
});
