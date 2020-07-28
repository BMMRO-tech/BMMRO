import React from "react";
import { render } from "@testing-library/react";
import HabitatUseList from "../HabitatUseList";

describe("HabitatUseList", () => {
  it("displays habitat use forms sorted by start time", () => {
    const items = [
      { data: { startTime: "11:00" }, path: "encounter/123/habitatUse/123" },
      { data: { startTime: "11:10" }, path: "encounter/123/habitatUse/456" },
      { data: { startTime: "11:20" }, path: "encounter/123/habitatUse/789" },
    ];
    const { queryAllByTestId } = render(<HabitatUseList items={items} />);

    const actual = queryAllByTestId("habitat-use-list-item");

    expect(actual[0]).toHaveTextContent("11:20");
    expect(actual[1]).toHaveTextContent("11:10");
    expect(actual[2]).toHaveTextContent("11:00");
  });
});
