/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderWithinFormik from "../../../../testUtils/renderWithinFormik";
import Select from "../Select";
import { FormErrorType } from "../../../../constants/forms";
import getFieldErrorMessage from "../../getFieldErrorMessage";

const htmlColors = ["teal", "tomato", "fuchsia", "lime", "moccasin", "linen"];

describe("Select", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <Select
        name="favoriteColor"
        labelText="Your favorite color"
        options={htmlColors}
      />,
      { favoriteColor: "" }
    );

    const select = getByRole("combobox", { name: "Your favorite color" });
    await act(async () => userEvent.selectOptions(select, "teal"));

    expect(select).toHaveDisplayValue("teal");
    expect(getFormValues().favoriteColor).toEqual("teal");
  });

  it("validates empty value if set as required", async () => {
    const { getFormErrors, queryByRole, getByRole } = renderWithinFormik(
      <Select
        name="favoriteColor"
        labelText="Your favorite color"
        options={htmlColors}
        isRequired={true}
      />,
      { favoriteColor: "" }
    );
    const select = getByRole("combobox", { name: "Your favorite color" });
    await act(async () => userEvent.selectOptions(select, ["teal"]));
    await act(async () => userEvent.tab());
    expect(
      queryByRole("alert", { name: "Your favorite color" })
    ).not.toBeInTheDocument();

    await act(async () => userEvent.selectOptions(select, ""));
    await act(async () => userEvent.tab());

    const expectedErrorMessage = getFieldErrorMessage(FormErrorType.EMPTY);
    expect(
      getByRole("alert", { name: "Your favorite color" })
    ).toBeInTheDocument();
    expect(getFormErrors().favoriteColor).toEqual(expectedErrorMessage);
  });
});
