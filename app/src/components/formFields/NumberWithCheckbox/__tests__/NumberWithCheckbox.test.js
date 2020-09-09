/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import NumberWithCheckbox from "../NumberWithCheckbox";

describe("NumberWithCheckbox", () => {
  it("disables number input & sets default value when checkbox is checked", async () => {
    const { getByRole, getFormValues } = renderWithinFormik(
      <NumberWithCheckbox
        name="favoriteNumber"
        labelText="Your favorite number"
        minValue={1}
        maxValue={100}
        checkboxLabel="No Favorite"
        checkboxDefaultValue="no-favorite"
      />,
      { favoriteNumber: "" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number",
    });
    const checkbox = getByRole("checkbox", {
      name: "No Favorite",
    });

    await act(async () => {
      userEvent.click(checkbox);
    });

    expect(numberInput).toHaveAttribute("disabled");
    expect(getFormValues().favoriteNumber).toBe("no-favorite");
  });

  it("disables field and checks box when checked previously", async () => {
    const { getByRole } = renderWithinFormik(
      <NumberWithCheckbox
        name="favoriteNumber"
        labelText="Your favorite number"
        minValue={1}
        maxValue={100}
        checkboxLabel="No Favorite"
        checkboxDefaultValue="no-favorite"
      />,
      { favoriteNumber: "no-favorite" }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number",
    });
    const checkbox = getByRole("checkbox", {
      name: "No Favorite",
    });

    expect(numberInput).toHaveAttribute("disabled");
    expect(checkbox).toHaveAttribute("checked");
  });
});
