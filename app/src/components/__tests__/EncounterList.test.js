import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EncounterList from "../EncounterList";
import {
  mockSingleDayData,
  mockSingleMonthData,
} from "../__fixtures__/encounterData";
import { fireEvent } from "@testing-library/react/pure";
import { monthNames } from "../../constants/monthNames";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import * as useEncountersByMonth from "../../hooks/useEncountersByMonth";
import { getEncountersByTimeRange } from "../../hooks/useEncountersByMonth";

describe("EncounterList", () => {
  const originalEnv = process.env;
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("displays encounter forms for a single day", async () => {
    jest
      .spyOn(useEncountersByMonth, "getEncountersByTimeRange")
      .mockResolvedValue(mockSingleDayData);
    const { queryAllByRole } = renderWithMockContexts(
      <EncounterList title="Today" encounters={mockSingleDayData} />
    );

    await waitFor(() => {
      expect(queryAllByRole("listitem")[0]).toHaveTextContent(
        "13AugE777Bottlenose dolphin - oceanicBimini"
      );
      expect(queryAllByRole("listitem")[1]).toHaveTextContent(
        "13AugE99Bottlenose dolphin - oceanicCat Island"
      );
    });
  });

  it("displays encounter forms over multiple days", async () => {
    jest
      .spyOn(useEncountersByMonth, "getEncountersByTimeRange")
      .mockResolvedValue(mockSingleMonthData);
    const { queryAllByRole } = renderWithMockContexts(
      <EncounterList
        title="Previous Encounters"
        encounters={mockSingleMonthData}
      />
    );
    await waitFor(() => {
      expect(queryAllByRole("listitem")[0]).toHaveTextContent(
        "02Jul5fBlainville's beaked whaleEA"
      );
      expect(queryAllByRole("listitem")[1]).toHaveTextContent(
        "11Jul23dfsd23423fdsBottlenose dolphin - coastalCay Sal"
      );
    });
  });

  it("displays message when no encounters in a month", () => {
    const { queryByText } = render(
      <EncounterList title="Previous Encounters" encounters={[]} />
    );

    const actual = queryByText("No encounters yet");

    expect(actual).not.toBeUndefined();
  });

  it("should have 'Previous encounters' as a dropdown", () => {
    jest
      .spyOn(useEncountersByMonth, "getEncountersByTimeRange")
      .mockResolvedValue(mockSingleMonthData);
    renderWithMockContexts(
      <EncounterList
        title="Previous Encounters"
        encounters={[mockSingleMonthData]}
      />
    );
    expect(screen.getByLabelText("Month")).toBeInTheDocument();
  });

  it("Should list the previous 24 months when user clicks on the 'Dropdown", async () => {
    const today = new Date();
    today.setMonth(today.getMonth() - 13);
    const dropDownValue =
      monthNames[today.getMonth()] + " " + today.getFullYear();
    jest
      .spyOn(useEncountersByMonth, "getEncountersByTimeRange")
      .mockResolvedValue(mockSingleMonthData);
    renderWithMockContexts(
      <EncounterList
        title="Previous Encounters"
        encounters={[mockSingleMonthData]}
      />
    );
    const monthDropdown = screen.getByLabelText("Month");
    expect(monthDropdown).toBeInTheDocument();
    await waitFor(() => userEvent.click(monthDropdown));
    expect(screen.getByText(dropDownValue)).toBeInTheDocument();
  });

  it("Should list the encounters for the month when a month is chosen on the dropdown", async () => {
    jest
      .spyOn(useEncountersByMonth, "getEncountersByTimeRange")
      .mockResolvedValue(mockSingleMonthData);
    const today = new Date();
    const dropDownValue =
      monthNames[today.getMonth() - 1] + " " + today.getFullYear();
    const { queryAllByRole } = renderWithMockContexts(
      <EncounterList
        title="Previous Encounters"
        encounters={[mockSingleMonthData]}
      />
    );
    fireEvent.change(screen.getByTestId("field-PreviousEncountersDropDown"), {
      target: { value: dropDownValue },
    });
    await waitFor(() => {
      expect(queryAllByRole("list")[0]).toHaveTextContent(
        "02Jul5fBlainville's beaked whaleEA"
      );
      expect(queryAllByRole("list")[0]).toHaveTextContent(
        "11Jul23dfsd23423fdsBottlenose dolphin - coastalCay Sal"
      );
    });
  });

  it("Should not print undefined undefined for Month and year if the encounter list call to firestore fails", async () => {
    jest
      .spyOn(useEncountersByMonth, "getEncountersByTimeRange")
      .mockResolvedValue([]);
    renderWithMockContexts(
      <EncounterList
        title="Previous Encounters"
        encounters={[mockSingleMonthData]}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText("undefined")).not.toBeInTheDocument();
    });
  });
});
