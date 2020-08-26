import { render, waitFor } from "@testing-library/react/pure";
import React from "react";
import Header from "../Header";

describe("Header", () => {
  it("should include the BMMRO logo", async () => {
    const { queryByTitle } = render(<Header />);

    await waitFor(() => expect(queryByTitle("BMMRO Logo")).toBeInTheDocument());
  });
});
