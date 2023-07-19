/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import RadioGroup from "../RadioGroup";

describe("RadioGroup", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getFormErrors, getByRole } = renderWithinFormik(
      <RadioGroup
        name="favoritePlanet"
        labelText="Your favorite planet"
        options={[
          { label: "Sun", value: "sun" },
          { label: "Moon", value: "moon" },
          { label: "Earth", value: "earth" },
        ]}
      />,
      { favoritePlanet: "" }
    );

    const radioOption = getByRole("radio", { name: "Moon" });

    await act(async () => {
      await userEvent.click(radioOption);
    });

    expect(getFormValues().favoritePlanet).toEqual("moon");
    expect(getFormErrors()).toEqual({});
  });

  it("does not allow input when field is disabled", async () => {
    const { getFormValues, getFormErrors, getByRole } = renderWithinFormik(
      <RadioGroup
        name="favoritePlanet"
        labelText="Your favorite planet"
        options={[
          { label: "Sun", value: "sun" },
          { label: "Moon", value: "moon" },
        ]}
        isDisabled
      />,
      { favoritePlanet: "" }
    );

    const radioOption = getByRole("radio", { name: "Moon" });

    await act(async () => {
      await userEvent.click(radioOption);
    });

    expect(getFormValues().favoritePlanet).toEqual("");
    expect(getFormErrors()).toEqual({});
  });
});
