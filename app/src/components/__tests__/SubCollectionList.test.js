import React from "react";
import { render } from "@testing-library/react";
import SubCollectionList from "../SubCollectionList";

describe("SubCollectionList", () => {
  describe("HabitatUse List", () => {
    it("displays habitat use forms sorted by start time", () => {
      const items = [
        { data: { startTime: "11:00:10" }, id: "123" },
        { data: { startTime: "11:00:20" }, id: "456" },
        { data: { startTime: "11:20:33" }, id: "789" },
      ];
      const { queryAllByRole } = render(
        <SubCollectionList items={items} type="habitat" />
      );

      const actual = queryAllByRole("listitem");

      expect(actual[0]).toHaveTextContent("11:20:33");
      expect(actual[1]).toHaveTextContent("11:00:20");
      expect(actual[2]).toHaveTextContent("11:00:10");
    });

    it("displays message when there are no list items", () => {
      const { queryByText } = render(
        <SubCollectionList items={[]} type="habitat" />
      );

      const noEntriesMessage = queryByText("No habitat use entries yet");

      expect(noEntriesMessage).not.toBeNull();
    });

    it("has a button to add habitat uses if the associated encounter was not yet exported", () => {
      const { queryByRole } = render(
        <SubCollectionList items={[]} type="habitat" />
      );

      expect(queryByRole("button", { name: "+ New" })).toBeInTheDocument();
    });

    it("does not have a button to add habitat uses if the associated encounter was exported", () => {
      const { queryByRole } = render(
        <SubCollectionList items={[]} isExported type="habitat" />
      );

      expect(queryByRole("button", { name: "+ New" })).not.toBeInTheDocument();
    });
  });

  describe("Biopsy List", () => {
    it("displays biopsy forms sorted by start time", () => {
      const items = [
        { data: { timeTaken: "11:00:10" }, id: "123" },
        { data: { timeTaken: "11:00:20" }, id: "456" },
        { data: { timeTaken: "11:20:33" }, id: "789" },
      ];
      const { queryAllByRole } = render(
        <SubCollectionList items={items} type="biopsy" />
      );

      const actual = queryAllByRole("listitem");

      expect(actual[0]).toHaveTextContent("11:20:33");
      expect(actual[1]).toHaveTextContent("11:00:20");
      expect(actual[2]).toHaveTextContent("11:00:10");
    });

    it("displays message when there are no list items", () => {
      const { queryByText } = render(
        <SubCollectionList items={[]} type="biopsy" />
      );

      const noEntriesMessage = queryByText("No biopsy entries yet");

      expect(noEntriesMessage).not.toBeNull();
    });

    it("has a button to add biopsy if the associated encounter was not yet exported", () => {
      const { queryByRole } = render(
        <SubCollectionList items={[]} type="biopsy" />
      );

      expect(queryByRole("button", { name: "+ New" })).toBeInTheDocument();
    });

    it("does not have a button to biopsy if the associated encounter was exported", () => {
      const { queryByRole } = render(
        <SubCollectionList items={[]} isExported type="biopsy" />
      );

      expect(queryByRole("button", { name: "+ New" })).not.toBeInTheDocument();
    });
  });
});
