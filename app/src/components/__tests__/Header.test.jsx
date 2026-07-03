import { waitFor } from "@testing-library/react/pure";
import React from "react";
import Header from "../Header";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";

describe("Header", () => {
  it("should include the BMMRO logo", async () => {
    const { queryByTitle } = renderWithMockContexts(<Header />, {
      hasPending: false,
    });

    await waitFor(() => expect(queryByTitle("BMMRO Logo")).toBeInTheDocument());
  });
});
