/** @jsx jsx */
import { jsx } from "@emotion/core";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";

import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import Checkbox from "../Checkbox";

describe("CheckBox", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <Checkbox
        name="testResult"
        labelText="BooleanTest"
      />,
      { testResult: false }
    );

    const checkboxInput = getByRole("checkbox", { name: "BooleanTest" });

    await act(async () => {
      await userEvent.click(checkboxInput);
    });

    expect(getFormValues().testResult).toEqual(true);
  });
});
