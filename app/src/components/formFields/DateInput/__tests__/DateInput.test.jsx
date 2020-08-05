/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act, fireEvent } from "@testing-library/react";
import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";
import DateInput from "../DateInput";

describe("DateInput", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-08-04T11:30:00.000Z").getTime()
    );
  });
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

    const expectedErrorMessage = getErrorMessage(FormErrorType.EMPTY);
    expect(getFormErrors().favoriteDate).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite date" })
    ).toHaveTextContent(expectedErrorMessage);
  });

  it("autofills date", () => {
    const { getFormValues } = renderWithinFormik(
      <DateInput name="defaultDate" labelText="Your favorite date" autofill />,
      { defaultDate: "" }
    );

    expect(getFormValues().defaultDate).toEqual("2020-08-04T11:30:00.000Z");
  });
});
