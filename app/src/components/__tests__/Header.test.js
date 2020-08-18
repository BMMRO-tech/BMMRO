import { render, waitFor } from "@testing-library/react/pure";
import React from "react";
import Header from "../Header";

describe("Header", () => {
  it("should include an image with with the alt text 'BMMRO logo'", async () => {
    const { queryByAltText } = render(<Header />);

    await waitFor(() =>
      expect(queryByAltText("BMMRO logo")).toBeInTheDocument()
    );
  });
});
