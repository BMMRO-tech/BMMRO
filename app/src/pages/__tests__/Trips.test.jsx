import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import {
  initTestEnv,
  getEmulatedFirestore,
  clearEmulatedData,
  cleanupTestEnv,
} from "../../utils/test/firestoreEmulator";
import { Datastore } from "../../datastore/datastore";
import Trips from "../Trips";

describe("TripsOverviewPage", () => {
  const projectId = "trips-overview-test-id";
  let firestoreEmulator;
  let datastore;
  const mockTrip = {
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
    date: new Date(),
    hasEnded: false,
  };

  beforeAll(async () => {
    await initTestEnv(projectId);
  });

  beforeEach(() => {
    firestoreEmulator = getEmulatedFirestore();
    datastore = new Datastore(firestoreEmulator);
  });

  afterEach(async () => {
    await clearEmulatedData();
  });

  afterAll(async () => {
    await cleanupTestEnv();
  });

  it("show encounter and trips tabs", async () => {
    renderWithMockContexts(<Trips />, {
      datastore,
    });

    await waitFor(() =>
      expect(
        screen.getByText("ENCOUNTERS", { selector: "button" }),
      ).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByText("TRIPS", { selector: "button" }),
      ).toBeInTheDocument(),
    );
  });
  it("show new trips button", async () => {
    renderWithMockContexts(<Trips />, {
      datastore,
      route: "/trips",
    });

    await waitFor(() =>
      expect(screen.getByTestId("new-trips-button")).toBeInTheDocument(),
    );
  });

  it("show warning when a trip has not been ended yet", async () => {
    await firestoreEmulator.collection("trip").doc("123").set(mockTrip);

    renderWithMockContexts(<Trips />, {
      datastore,
    });

    await waitFor(() =>
      expect(
        screen.getByText("please end trip before exporting"),
      ).toBeInTheDocument(),
    );
  });
});
