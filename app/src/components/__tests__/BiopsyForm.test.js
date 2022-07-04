import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import BiopsyForm from "../BiopsyForm";


import userEvent from "@testing-library/user-event";


describe("BiopsyForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:12.000Z").getTime()
    );
  });

  it("submits the form with correct values if all required fields are completed", async () => {
    let formValues;
    const mockHandleSubmit = (values) => {
      formValues = values;
    };
   
    const { getByRole } = render(
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
      expect(formValues.Date).toEqual(new Date("2020-05-04T11:30:12.000Z"));
      expect(formValues.Time).toEqual("11:30:12");
      })
  });

  it("contains cancel button", () => {
    const { queryByRole } = render(<BiopsyForm />);

    expect(queryByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
