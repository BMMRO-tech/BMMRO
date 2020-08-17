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
  it("displays enocounter forms for a single day", () => {
    const { queryAllByRole } = render(
      <EncounterList title="Today" items={mockSingleDayData} />
    );

    const actual = queryAllByRole("listitem");

    expect(actual[0]).toHaveTextContent(
      "13AugE777 Bottlenose dolphin - oceanicBimini"
    );
    expect(actual[1]).toHaveTextContent(
      "13AugE99 Bottlenose dolphin - oceanicCat Island"
    );
  });

  it("displays enocounter forms over multiple days", () => {
    const { queryAllByRole } = render(
      <EncounterList title="Previous Encounters" items={mockSingleMonthData} />
    );

    const actual = queryAllByRole("listitem");

    expect(actual[0]).toHaveTextContent("02Jul5f Blainville's beaked whaleEA");
    expect(actual[1]).toHaveTextContent(
      "11Jul23dfsd23423fds Bottlenose dolphin - coastalCay Sal"
    );
  });

  it("displays enocounter forms over multiple months", () => {
    const { queryAllByRole } = render(
      <EncounterList
        title="Previous Encounters"
        items={mockMultiMonthData}
        showSubheader
      />
    );

    const actual = queryAllByRole("list");

    expect(actual[0].children[0]).toHaveTextContent("August 2020");
    expect(actual[0].children[1]).toHaveTextContent(
      "02Jul5f Blainville's beaked whaleEA"
    );
    expect(actual[0].children[2]).toHaveTextContent(
      "11Jul23dfsd23423fds Bottlenose dolphin - coastalCay Sal"
    );

    expect(actual[1].children[0]).toHaveTextContent("June 2020");
    expect(actual[1].children[1]).toHaveTextContent(
      "12JunE777 Clymene dolphinBimini"
    );
  });

  it("displays message when no encounters in a month", () => {
    const { queryByText } = render(
      <EncounterList title="Previous Encounters" items={[]} />
    );

    const actual = queryByText("No encounters yet");

    expect(actual).not.toBeUndefined();
  });

  it("triggers callback when 'load more' pressed", async () => {
    const mockLoadMore = jest.fn();
    const { getByText } = render(
      <EncounterList
        title="Previous Encounters"
        items={[]}
        loadMore={mockLoadMore}
      />
    );

    const loadMoreLink = getByText("Load more");
    await userEvent.click(loadMoreLink);

    expect(mockLoadMore.mock.calls.length).toBe(1);
  });
});
