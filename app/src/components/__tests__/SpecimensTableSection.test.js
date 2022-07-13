import React from "react";
import SpecimensTableSection from "../SpecimensTableSection";
import renderWithinFormik from "../../utils/test/renderWithinFormik";
import userEvent from "@testing-library/user-event";
import { waitFor, render } from "@testing-library/react";

describe("SpecimensTableSection", () => {
  it("adds new row when add specimen record button is clicked", async () => {
    const { getAllByRole, getByRole } = renderWithinFormik(<SpecimensTableSection />);

    const addSpecimensInput = getByRole("button", { name: "Add Specimen"});
    userEvent.click(addSpecimensInput);

    const items = getAllByRole("textbox", { name: "Specimen #" });

    await waitFor(async () => {
      expect(items).toHaveLength(2);
    });

  });
});
