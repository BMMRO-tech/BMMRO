/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import TextInput from "../TextInput";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";

describe("TextInput", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TextInput name="favoriteColor" labelText="Your favorite color" />,
      { favoriteColor: "" }
    );

    const textInput = getByRole("textbox", { name: "Your favorite color" });
    await userEvent.type(textInput, "blue", { delay: 1 });

    expect(getFormValues().favoriteColor).toEqual("blue");
  });

  it("does not display an error when field value is correct", async () => {
    const { getByRole, queryByRole } = renderWithinFormik(
      <TextInput
        name="favoriteColor"
        labelText="Your favorite color"
        isRequired
      />,
      { favoriteColor: "" }
    );

    const textInput = getByRole("textbox", {
      name: "Your favorite color *",
    });
    await act(async () => {
      await userEvent.type(textInput, "mango", { delay: 1 });
      userEvent.tab();
    });

    expect(
      queryByRole("alert", { name: "Your favorite color" })
    ).not.toBeInTheDocument();
  });

  it("does not allow user to input more characters than max length", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TextInput
        name="favoriteColor"
        labelText="Your favorite color"
        maxLength={5}
      />,
      { favoriteColor: "" }
    );

    const textInput = getByRole("textbox", { name: "Your favorite color" });
    await act(async () => {
      await userEvent.type(textInput, "tomato", { delay: 1 });
      userEvent.tab();
    });

    expect(getFormValues().favoriteColor).toEqual("tomat");
  });

  it("validates empty inputs if set as required", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <TextInput
        name="favoriteColor"
        labelText="Your favorite color"
        isRequired
      />,
      { favoriteColor: "" }
    );

    await act(async () => {
      const textInput = getByRole("textbox", { name: "Your favorite color *" });
      userEvent.click(textInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(FormErrorType.EMPTY);
    expect(getFormErrors().favoriteColor).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite color" })
    ).toHaveTextContent(expectedErrorMessage);
  });

  it("does not allow input when field is disabled", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TextInput
        name="favoriteColor"
        labelText="Your favorite color"
        isDisabled
      />,
      { favoriteColor: "" }
    );

    const textInput = getByRole("textbox", { name: "Your favorite color" });
    await userEvent.type(textInput, "blue", { delay: 1 });

    expect(getFormValues().favoriteColor).toEqual("");
  });
});
