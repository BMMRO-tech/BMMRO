/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import NumberWithCheckbox from "../NumberWithCheckbox";
import "@testing-library/jest-dom/extend-expect";

describe("NumberWithCheckbox", () => {
  it("disables number input & sets default value when checkbox is checked", async () => {
    const { getByRole, getFormValues } = renderWithinFormik(
      <NumberWithCheckbox
        numberInputName="favoriteNumber"
        labelText="Your favorite number"
        minValue={1}
        maxValue={100}
        checkboxName="noFavorite"
        checkboxLabel="No Favorite"
      />,
      { favoriteNumber: "", noFavorite: false }
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
    expect(getFormValues().noFavorite).toBe(true);
  });

  it("disables field and checks box when checked previously", async () => {
    const { findByRole } = renderWithinFormik(
      <NumberWithCheckbox
        numberInputName="favoriteNumber"
        labelText="Your favorite number"
        minValue={1}
        maxValue={100}
        checkboxName="noFavorite"
        checkboxLabel="No Favorite"
      />,
      { favoriteNumber: "", noFavorite: true }
    );

    const numberInput = await findByRole("spinbutton", {
      name: "Your favorite number",
    });
    const checkbox = await findByRole("checkbox", {
      name: "No Favorite",
    });

    expect(numberInput).toHaveAttribute("disabled");
    expect(checkbox).toHaveAttribute("checked");
  });

  it("displays the latest user input when checkbox unchecked", async () => {
    const { getByRole, getFormValues } = renderWithinFormik(
      <NumberWithCheckbox
        numberInputName="favoriteNumber"
        labelText="Your favorite number"
        minValue={1}
        maxValue={100}
        checkboxName="noFavorite"
        checkboxLabel="No Favorite"
      />,
      { favoriteNumber: "", noFavorite: false }
    );

    const numberInput = getByRole("spinbutton", {
      name: "Your favorite number",
    });
    const checkbox = getByRole("checkbox", {
      name: "No Favorite",
    });

    await act(async () => {
      await userEvent.type(numberInput, "12", { delay: 1 });
      userEvent.dblClick(checkbox);
    });

    expect(getFormValues().favoriteNumber).toBe(12);
    expect(numberInput).not.toHaveAttribute("disabled");
    expect(checkbox).not.toHaveAttribute("checked");
  });
});
