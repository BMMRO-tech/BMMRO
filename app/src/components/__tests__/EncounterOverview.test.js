import { render } from "@testing-library/react";
import React from "react";
import EncounterOverview from "../EncounterOverview";

describe("EncounterOverview", () => {
  const defaultEncounter = {
    id: 1,
    sequenceNumber: "E123",
    species: "some species",
    area: "some area",
  };

  it("does not display a message when the encounter was not exported", async () => {
    const encounter = {
      ...defaultEncounter,
      exported: false,
    };

    const { queryByTestId } = render(
      <EncounterOverview encounter={encounter} />
    );

    expect(queryByTestId("exported-info")).not.toBeInTheDocument();
  });

  it("displays a message when the encounter was already exported", async () => {
    const exportedEncounter = {
      ...defaultEncounter,
      exported: true,
    };

    const { queryByTestId } = render(
      <EncounterOverview encounter={exportedEncounter} />
    );

    expect(queryByTestId("exported-info")).toBeInTheDocument();
  });
});
