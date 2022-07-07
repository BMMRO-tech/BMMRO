import React from "react";
import { fireEvent, render } from "@testing-library/react";
import DartHitSection from "../DartHitSection";
import { it } from "date-fns/locale";

describe.skip("Dart Hit Section", () => {
  it("contains a whale id input box", () => {
    const { queryByRole } = render(<DartHitSection />);

    expect(queryByRole("textbox", { name: "WhaleID" })).toBeInTheDocument();
  });

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

  // it("contains left and right radio buttons", () => {
  //   const { queryByRole } = render(<DartHitSection />);

  //   expect(queryByRole("radiobutton", { name: "WhaleSide" })).toBeInTheDocument();
  // });

  // it("contains did it hit the fin when upper dorsal is selected"), () => {
  //   const { queryByText, getByTestId } = render(<DartHitSection />);

  //   fireEvent(
  //     getByTestId("upperDorsal"),
  //     new MouseEvent("click", {
  //       bubbles: true,
  //       cancelable: true,
  //     })
  //   );
  //   expect(queryByText("Did it hit the fin?")).toBeInTheDocument();
  // });
});
