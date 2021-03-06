import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EncounterList from "../EncounterList";
import {
  mockSingleDayData,
  mockSingleMonthData,
  mockMultiMonthData,
} from "../__fixtures__/encounterData";

describe("EncounterList", () => {
  it("displays encounter forms for a single day", () => {
    const { queryAllByRole } = render(
      <EncounterList title="Today" encounters={mockSingleDayData} />
    );

    const actual = queryAllByRole("listitem");

    expect(actual[0]).toHaveTextContent(
      "13AugE777Bottlenose dolphin - oceanicBimini"
    );
    expect(actual[1]).toHaveTextContent(
      "13AugE99Bottlenose dolphin - oceanicCat Island"
    );
  });

  it("displays encounter forms over multiple days", () => {
    const { queryAllByRole } = render(
      <EncounterList
        title="Previous Encounters"
        encounters={mockSingleMonthData}
      />
    );

    const actual = queryAllByRole("listitem");

    expect(actual[0]).toHaveTextContent("02Jul5fBlainville's beaked whaleEA");
    expect(actual[1]).toHaveTextContent(
      "11Jul23dfsd23423fdsBottlenose dolphin - coastalCay Sal"
    );
  });

  it("displays encounter forms over multiple months", () => {
    const { queryAllByRole } = render(
      <EncounterList
        title="Previous Encounters"
        encounters={mockMultiMonthData}
        showSubheader
      />
    );

    const actual = queryAllByRole("list");

    expect(actual[0].children[0]).toHaveTextContent("August 2020");
    expect(actual[0].children[1]).toHaveTextContent(
      "02Jul5fBlainville's beaked whaleEA"
    );
    expect(actual[0].children[2]).toHaveTextContent(
      "11Jul23dfsd23423fdsBottlenose dolphin - coastalCay Sal"
    );

    expect(actual[1].children[0]).toHaveTextContent("June 2020");
    expect(actual[1].children[1]).toHaveTextContent(
      "12JunE777Clymene dolphinBimini"
    );
  });

  it("displays message when no encounters in a month", () => {
    const { queryByText } = render(
      <EncounterList title="Previous Encounters" encounters={[]} />
    );

    const actual = queryByText("No encounters yet");

    expect(actual).not.toBeUndefined();
  });

  it("triggers callback when 'Load previous month' pressed", async () => {
    const mockLoadMore = jest.fn();
    const { getByText } = render(
      <EncounterList
        title="Previous Encounters"
        encounters={[]}
        loadMore={mockLoadMore}
      />
    );

    const loadMoreLink = getByText("Load previous month");
    await userEvent.click(loadMoreLink);

    expect(mockLoadMore.mock.calls.length).toBe(1);
  });
});
