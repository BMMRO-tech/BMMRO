import React from "react";
import { fireEvent } from "@testing-library/react";
import DartHitSection from "../DartHitSection";
import renderWithinFormik from "../../utils/test/renderWithinFormik";

describe("Dart Hit Section", () => {
  it.each([
    ["Lower Peduncle"],
    ["Upper Peduncle"],
    ["Lower Dorsal"],
    ["Upper Dorsal"],
    ["Lower Thoracic"],
    ["Upper Thoracic"],
  ])(
    "shows lower Peduncle when bottom right section of the svg is clicked",
    async (val) => {
      const { queryByText, getByTestId } = renderWithinFormik(
        <DartHitSection />
      );

      fireEvent(
        getByTestId(val),
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      );
      expect(queryByText("Area Hit : " + val)).toBeInTheDocument();
    }
  );

  it("contains left and right radio buttons", () => {
    const { queryByText } = renderWithinFormik(<DartHitSection />);
    expect(queryByText("Left")).toBeInTheDocument();
    expect(queryByText("Right")).toBeInTheDocument();
  });

  it("contains option did it hit the fin when upper dorsal is selected", () => {
    const { queryByText, getByTestId } = renderWithinFormik(<DartHitSection />);

    fireEvent(
      getByTestId("Upper Dorsal"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(queryByText("Did it hit the fin?")).toBeInTheDocument();
  });

  it("does not contain option did it hit the fin when other then upper dorsal is selected", () => {
    const { queryByText, getByTestId } = renderWithinFormik(<DartHitSection />);

    fireEvent(
      getByTestId("Lower Dorsal"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(queryByText("Did it hit the fin?")).not.toBeInTheDocument();
  });
});
