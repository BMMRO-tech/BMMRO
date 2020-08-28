import React from "react";
import { render } from "@testing-library/react";
import HabitatUseList from "../HabitatUseList";

describe("HabitatUseList", () => {
  it("displays habitat use forms sorted by start time", () => {
    const items = [
      { data: { startTime: "11:00:10" }, id: "123" },
      { data: { startTime: "11:00:20" }, id: "456" },
      { data: { startTime: "11:20:33" }, id: "789" },
    ];
    const { queryAllByRole } = render(<HabitatUseList items={items} />);

    const actual = queryAllByRole("listitem");

    expect(actual[0]).toHaveTextContent("11:20:33");
    expect(actual[1]).toHaveTextContent("11:00:20");
    expect(actual[2]).toHaveTextContent("11:00:10");
  });

  it("displays message when there are no list items", () => {
    const { queryByText } = render(<HabitatUseList items={[]} />);

    const noEntriesMessage = queryByText("No habitat use entries yet");

    expect(noEntriesMessage).not.toBeNull();
  });

  it("has a button to add habitat uses if the associated encounter was not yet exported", () => {
    const { queryByRole } = render(<HabitatUseList items={[]} />);

    expect(queryByRole("button", { name: "+ New" })).toBeInTheDocument();
  });

  it("does not have a button to add habitat uses if the associated encounter was exported", () => {
    const { queryByRole } = render(
      <HabitatUseList items={[]} encounterExported />
    );

    expect(queryByRole("button", { name: "+ New" })).not.toBeInTheDocument();
  });
});
