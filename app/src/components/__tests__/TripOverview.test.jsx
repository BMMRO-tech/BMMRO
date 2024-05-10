import { render } from "@testing-library/react";
import React from "react";
import TripOverview from "../TripOverview";

describe("TripOverview", () => {
  const defaultTrip = {
    area: "East Berry Islands",
    engineHoursMeterReading: "",
    gpsFileName: "24_0510-Od.txt",
    numberOfObservers: 0,
    observers: "",
    project: "",
    time: "10:29",
    tripId: "24_0510Od123",
    tripNumber: 123,
    vessel: "Odyssey",
    windDirection: "",
    windSpeed: "",
    date: new Date("2020-05-04T11:30:12.000Z"),
  };

  it("displays a trip details", () => {
    const trip = {
      ...defaultTrip,
    };

    const { queryByTestId } = render(<TripOverview trip={trip} />);

    expect(queryByTestId("trip-info")).toBeInTheDocument();
  });

  it("has a link to the edit page for trip", () => {
    const trip = {
      ...defaultTrip,
    };

    const { getByRole } = render(<TripOverview trip={trip} />);

    //TODO: editing trip link
    expect(getByRole("link").href).toContain("");
  });
});
