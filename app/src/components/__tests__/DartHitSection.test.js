import React from "react";
import { render } from "@testing-library/react";
import DartHitSection from "../DartHitSection";

describe("Dart Hit Section", () => {
  it.skip("shows biopsy banner and new button", () => {
    const { queryByText } = render(<DartHitSection />);

    expect(queryByText("Select Dart Hit Area")).toBeInTheDocument();
  });

  it.skip("shows lower Peduncle when bottom right section of the svg is clicked", () => {
    const { queryByText, getByTestId } = render(<DartHitSection />);

    getByTestId("lowerPeducle").click();

    expect(queryByText("Lower Peduncle")).toBeInTheDocument();
  });
});
