/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { act, fireEvent } from "@testing-library/react";
import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";
import DateInput from "../DateInput";
import * as time from "../../../../utils/time";
import "@testing-library/jest-dom/extend-expect";

describe("DateInput", () => {
  beforeEach(() => {
    jest
      .spyOn(time, "getCurrentDate")
      .mockReturnValue(
        new Date(
          new Date(
            new Date("2020-08-04T11:30:00.000Z").getTime()
          ).setMilliseconds(0)
        )
      );
  });
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <DateInput name="favoriteDate" labelText="Your favorite date" />,
      { favoriteDate: "" }
    );

    const dateInput = getByRole("textbox", { name: "Your favorite date" });

    await act(async () => {
      await fireEvent.change(dateInput, { target: { value: "22 July 2020" } });
      fireEvent.blur(dateInput);
    });

    expect(getFormValues().favoriteDate).toEqual(
      new Date(2020, 6, 22).toISOString()
    );
  });

  it("does not display an error when field value is correct", async () => {
    const { getByRole, queryByRole } = renderWithinFormik(
      <DateInput
        name="favoriteDate"
        labelText="Your favorite date"
        isRequired
      />,
      { favoriteDate: "" }
    );

    const dateInput = getByRole("textbox", { name: "Your favorite date *" });
    await act(async () => {
      await fireEvent.change(dateInput, { target: { value: "22 July 2020" } });
      fireEvent.blur(dateInput);
    });

    expect(
      queryByRole("alert", { name: "Your favorite date" })
    ).not.toBeInTheDocument();
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

    const dateInput = getByRole("textbox", { name: "Your favorite date *" });
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

  it("does not allow input when field is disabled", async () => {
    const { getByRole } = renderWithinFormik(
      <DateInput
        name="favoriteDate"
        labelText="Your favorite date"
        isRequired
        isDisabled
      />,
      { favoriteDate: "" }
    );

    const dateInput = getByRole("textbox", { name: "Your favorite date *" });

    expect(dateInput).toHaveAttribute("disabled");
  });
});
