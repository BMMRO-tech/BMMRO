/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act, fireEvent } from "@testing-library/react";
import renderWithinFormik from "../../../../testUtils/renderWithinFormik";
import { FormErrorType } from "../../../../constants/forms";
import getFieldErrorMessage from "../../getFieldErrorMessage";
import DateInput from "../DateInput";

describe("DateInput", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <DateInput name="favoriteDate" labelText="Your favorite date" />,
      { favoriteDate: "" }
    );

    const dateInput = getByRole("textbox", { name: "Your favorite date" });
    await fireEvent.change(dateInput, { target: { value: "22 July 2020" } });

    expect(getFormValues().favoriteDate).toEqual(
      new Date(2020, 6, 22).toISOString()
    );
  });

  it("validates empty inputs if set as required", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <DateInput
        name="favoriteDate"
        labelText="Your favorite date"
        isRequired
      />,
      { favoriteDate: "" }
    );

    const dateInput = getByRole("textbox", { name: "Your favorite date" });
    await act(async () => {
      await fireEvent.change(dateInput, { target: { value: "" } });
      fireEvent.blur(dateInput);
    });

    const expectedErrorMessage = getFieldErrorMessage(FormErrorType.EMPTY);
    expect(getFormErrors().favoriteDate).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite date" })
    ).toHaveTextContent(expectedErrorMessage);
  });
});
