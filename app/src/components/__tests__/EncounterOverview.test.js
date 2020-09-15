import { render } from "@testing-library/react";
import React from "react";
import EncounterOverview from "../EncounterOverview";

describe("EncounterOverview", () => {
  const defaultEncounter = {
    sequenceNumber: "E123",
    species: "some species",
    area: "some area",
  };

  it("does not display a message when the encounter was not yet exported", () => {
    const encounter = {
      ...defaultEncounter,
      exported: false,
    };

    const { queryByTestId } = render(
      <EncounterOverview encounter={encounter} encounterId={1} />
    );

    expect(queryByTestId("exported-info")).not.toBeInTheDocument();
  });

  it("displays a message when the encounter was already exported", () => {
    const exportedEncounter = {
      ...defaultEncounter,
      exported: true,
    };

    const { queryByTestId } = render(
      <EncounterOverview encounter={exportedEncounter} encounterId={1} />
    );

    expect(queryByTestId("exported-info")).toBeInTheDocument();
  });

  it("has a link to the edit page if the encounter was not yet exported", () => {
    const encounter = {
      ...defaultEncounter,
      exported: false,
    };

    const { getByRole } = render(
      <EncounterOverview encounter={encounter} encounterId={1} />
    );

    expect(getByRole("link").href).toContain("/encounters/1/edit");
  });

  it("has a link to the view page if the encounter was exported", () => {
    const encounter = {
      ...defaultEncounter,
      exported: true,
    };

    const { getByRole } = render(
      <EncounterOverview encounter={encounter} encounterId={1} />
    );

    expect(getByRole("link").href).toContain("/encounters/1/view");
  });
});
