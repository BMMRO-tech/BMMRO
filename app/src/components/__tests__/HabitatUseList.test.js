import React from "react";
import { render } from "@testing-library/react";
import HabitatUseList from "../HabitatUseList";

describe("HabitatUseList", () => {
  it("displays habitat use forms sorted by start time", () => {
    const items = [
      { data: { startTime: "11:00" }, id: "123" },
      { data: { startTime: "11:10" }, id: "456" },
      { data: { startTime: "11:20" }, id: "789" },
    ];
    const { queryAllByRole } = render(<HabitatUseList items={items} />);

    const actual = queryAllByRole("listitem");

    expect(actual[0]).toHaveTextContent("11:20");
    expect(actual[1]).toHaveTextContent("11:10");
    expect(actual[2]).toHaveTextContent("11:00");
  });
});
