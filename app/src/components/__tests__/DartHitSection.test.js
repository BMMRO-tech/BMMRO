import React from "react";
import { fireEvent, render } from "@testing-library/react";
import DartHitSection from "../DartHitSection";

describe("Dart Hit Section", () => {
  it("shows select dart hit area text", () => {
    const { queryByText } = render(<DartHitSection />);

    expect(queryByText("Select Dart Hit Area")).toBeInTheDocument();
  });

  it("shows lower Peduncle when bottom right section of the svg is clicked", () => {
    const { queryByText, getByTestId } = render(<DartHitSection />);

    fireEvent(
      getByTestId("lowerPeducle"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(queryByText("Lower Peduncle")).toBeInTheDocument();
  });
});
