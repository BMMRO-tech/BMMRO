import React from "react";
import { render } from "@testing-library/react";
import BiopsyList from "../BiopsyList";

describe("BiopsyList", () => {
  it("shows biopsy banner and new button", () => {
    const { queryByRole, queryByText } = render(<BiopsyList />);

    expect(queryByText("Biopsies")).toBeInTheDocument();

    expect(queryByRole("button", { name: "+ New" })).toBeInTheDocument();
  });
});
