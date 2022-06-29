import React from "react";
import { render } from "@testing-library/react";
import BiopsyForm from "../BiopsyForm";

describe("BiopsyForm", () => {
  it("contains cancel button", () => {
    const { queryByRole } = render(<BiopsyForm />);

    expect(queryByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
