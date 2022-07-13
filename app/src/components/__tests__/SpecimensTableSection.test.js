import React from "react";
import SpecimensTableSection from "../SpecimensTableSection";
import renderWithinFormik from "../../utils/test/renderWithinFormik";
import userEvent from "@testing-library/user-event";
import { waitFor, render } from "@testing-library/react";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
}));

describe("SpecimensTableSection", () => {
  it.skip("contains specimen#, tissue type and tissue storage sections on open", async () => {
    const { getByRole, getByText } = renderWithinFormik(
      <SpecimensTableSection />
    );

    const specimenNumberInput = getByRole("textbox", { name: "Specimen #" });
    // const tissueTypeInput = getByRole("combobox", { name: "Tissue type" });
    // const tissueStorageInput = getByRole("combobox", { name: "Tissue storage" });

    await userEvent.type(specimenNumberInput, "123", { delay: 1 });
    // userEvent.selectOptions(tissueTypeInput, "Skin");
    // userEvent.selectOptions(tissueStorageInput, "-80");

    await waitFor(() => {
      expect(getByText("123")).toBeInTheDocument();
      // expect(getByText("Skin")).toBeInTheDocument();
      // expect(getByText("-80")).toBeInTheDocument();
    });
  });
});
