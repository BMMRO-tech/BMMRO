/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import TextAreaInput from "../TextAreaInput";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";

describe("TextAreaInput", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TextAreaInput
        name="favoriteSentence"
        labelText="Your favorite sentence"
      />,
      { favoriteSentence: "" }
    );

    const textInput = getByRole("textbox", { name: "Your favorite sentence" });
    // This is required so that userEvent does not shuffle the input.
    // This issue has been fixed in https://github.com/testing-library/user-event/issues/391 but has not yet been updated in jest-dom.
    textInput.selectionStart = 0;

    await userEvent.type(textInput, "I like the color blue.", { delay: 1 });

    expect(getFormValues().favoriteSentence).toEqual("I like the color blue.");
  });

  it("does not display an error when field value is correct", async () => {
    const { getByRole, queryByRole } = renderWithinFormik(
      <TextAreaInput
        name="favoriteSentence"
        labelText="Your favorite sentence"
        isRequired
      />,
      { favoriteSentence: "" }
    );

    const textInput = getByRole("textbox", {
      name: "Your favorite sentence *",
    });
    textInput.selectionStart = 0;

    await act(async () => {
      await userEvent.type(textInput, "I like the color mango.", { delay: 1 });
      userEvent.tab();
    });

    expect(
      queryByRole("alert", { name: "Your favorite sentence" })
    ).not.toBeInTheDocument();
  });

  it("does not allow user to input more characters than max length", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <TextAreaInput
        name="favoriteSentence"
        labelText="Your favorite sentence"
        maxLength={10}
      />,
      { favoriteSentence: "" }
    );

    const textInput = getByRole("textbox", { name: "Your favorite sentence" });
    textInput.selectionStart = textInput.selectionEnd = "I like the color blue.".length;
    await userEvent.type(textInput, "I like the color blue.", { delay: 1 });

    expect(getFormValues().favoriteSentence).toEqual("I like the");
  });

  it("validates empty inputs if set as required", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <TextAreaInput
        name="favoriteSentence"
        labelText="Your favorite sentence"
        isRequired
      />,
      { favoriteSentence: "" }
    );

    await act(async () => {
      const textInput = getByRole("textbox", {
        name: "Your favorite sentence *",
      });
      userEvent.click(textInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(FormErrorType.EMPTY);
    expect(getFormErrors().favoriteSentence).toEqual(expectedErrorMessage);
    expect(
      getByRole("alert", { name: "Your favorite sentence" })
    ).toHaveTextContent(expectedErrorMessage);
  });
});
