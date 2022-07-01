import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import BiopsyForm from "../BiopsyForm";

import userEvent from "@testing-library/user-event";


describe("BiopsyForm", () => {
  it("submits the form with correct values if all required fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };
   
    const { getByText, getByRole } = render(
      <BiopsyForm
        handleSubmit={mockHandleSubmit}
      />
     );
    
     const speciesInput = getByRole("combobox", { name: "Species *" });
    const submitButton = getByRole("button", { name: "Save" });

     userEvent.selectOptions(speciesInput, "Fin whale");
     userEvent.click(submitButton);

      await waitFor(() => {
      expect(formValues.species).toEqual("Fin whale");
      })
  });

  it("contains cancel button", () => {
    const { queryByRole } = render(<BiopsyForm />);

    expect(queryByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
